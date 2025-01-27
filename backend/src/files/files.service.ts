import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFileDTO, File, FileDocument } from './files.schema';
import { ExpensesService } from '../expenses/expenses.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { promises as fs } from 'fs';
import { HfInference } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';
import { CategoriesService } from '../categories/categories.service';
import { ExpenseDTO } from '../expenses/expenses.schema';
import { Service } from '../base/service';

const Tesseract = require('tesseract.js');

@Injectable()
export class FilesService extends Service<File> {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        @Inject(forwardRef(() => CurrenciesService))
        private currencyService: CurrenciesService,
        @Inject(forwardRef(() => ExpensesService))
        private expenseService: ExpensesService,
        @Inject(forwardRef(() => CategoriesService))
        private categoryService: CategoriesService,
        private configService: ConfigService,
    ) {
        super(fileModel);
    }

    async create_file_entry(
        createFileDto: CreateFileDTO,
        userId: string,
        [fileBuffer, size]: [Buffer, number],
    ) {
        const newFile = new this.fileModel({
            ...createFileDto,
            data: fileBuffer,
            size,
            id_user: userId,
        });

        newFile.save();

        if (createFileDto.doOCR) {
            const addedExpenses: Omit<ExpenseDTO, '_id' | 'id_user'>[] =
                await this.doOCR(fileBuffer, newFile.filename);

            return addedExpenses;
        }
    }

    async findFileById(id: string): Promise<File | null> {
        return this.fileModel.findById(id).exec();
    }

    async findFileByFilename(filename: string): Promise<File | null> {
        return this.fileModel.findOne({ filename }).exec();
    }

    async getFileID(filename: string): Promise<string> {
        return (
            await this.fileModel.findOne({ filename }).exec()
        )._id.toString();
    }

    async detectCurrency(words: string[]): Promise<string> {
        const currencies = await fs.readFile(
            `${__dirname}/../currencies/currencies.default.json`,
            'utf8',
        );

        const currenciesParsed = JSON.parse(currencies);

        const shortnames = currenciesParsed
            .map((currency) => currency.shortname)
            .join('|');
        const currencyCodePattern = new RegExp(`\\b(?:${shortnames})\\b`, 'i');

        const currencyPatterns = [/\$|€|£|¥|₹/, currencyCodePattern];

        let detectedCurrency: string | null = null;

        for (const word of words) {
            for (const symbolPattern of currencyPatterns.slice(0, 1)) {
                const match = word.match(symbolPattern);
                if (match) {
                    detectedCurrency = match[0];

                    return detectedCurrency;
                }
            }

            for (const tlaPattern of currencyPatterns.slice(1)) {
                const match = word.match(tlaPattern);
                if (match) {
                    detectedCurrency = match[0];
                    break;
                }
            }

            if (detectedCurrency) {
                break;
            }
        }

        return detectedCurrency || 'No currency found';
    }

    async extractNumbers(inputString: string): Promise<number[]> {
        const regex = /-?\d+([.,]\d+)?/g;

        const matches = inputString.match(regex);

        if (matches) {
            return matches.map((match) => {
                const normalizedMatch = match.replace(',', '.');
                return parseFloat(normalizedMatch);
            });
        }

        return [];
    }

    async escapeRegExp(symbol: string): Promise<string> {
        return symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async extractWordsUntilSymbol(
        input: string,
        symbol: string,
    ): Promise<string> {
        const escapedSymbol = await this.escapeRegExp(symbol);

        const regex = new RegExp(`^(.*?)${escapedSymbol}`, 's');

        const match = input.match(regex);

        if (match && match[1]) {
            return match[1].trim().replace(/\s+/g, ' ');
        }

        return '';
    }

    async classifyExpense(expenseDescription: string): Promise<string> {
        const hf = new HfInference(
            this.configService.get<string>('HUGGINGFACE_API_KEY'),
        );
        const scoreThreshold: number = 0.4;

        try {
            const categories = await fs.readFile(
                `${__dirname}/../categories/categories.default.json`,
                'utf8',
            );

            const categoriesParsed = JSON.parse(categories);

            const candidateLabels = categoriesParsed
                .map((currency) => currency.name)
                .slice(0, 10); // TODO: Cycle through them all

            const result = (
                await hf.zeroShotClassification({
                    model: 'facebook/bart-large-mnli',
                    inputs: expenseDescription,
                    parameters: {
                        candidate_labels: candidateLabels,
                    },
                })
            )[0];

            console.log('Classification Results: ', result);

            const highestScoreIndex = result.scores.indexOf(
                Math.max(...result.scores),
            );
            const bestLabel =
                result.scores[0] >= scoreThreshold
                    ? result.labels[highestScoreIndex]
                    : 'General';

            console.log('Best Expense Category:', bestLabel);
            return bestLabel;
        } catch (error) {
            console.error('Error classifying expense:', error);
        }
    }

    private async extractTextFromImage(data: Buffer): Promise<string> {
        const recog = await Tesseract.recognize(data, 'eng');
        return recog.data.text;
    }

    private tokenizeText(text: string): string[] {
        return text.split(/(\n)/).filter((line) => line.trim() !== '');
    }

    private async processExpenses(
        textParts: string[],
        currencyName: string,
        uploadedFile: File,
    ): Promise<Omit<ExpenseDTO, '_id' | 'id_user'>[]> {
        const addedExpenses: Omit<ExpenseDTO, '_id' | 'id_user'>[] = [];
        let expenseNumber = 0;
        let index = 0;

        while (index < textParts.length) {
            if (!textParts[index].includes(currencyName)) {
                index++;
                continue;
            }

            const expenseDTO = await this.createExpenseDTO(
                textParts[index],
                currencyName,
                expenseNumber,
                uploadedFile,
            );

            await this.expenseService.create(expenseDTO, uploadedFile.id_user);
            addedExpenses.push(expenseDTO);
            expenseNumber++;
            index++;
        }

        return addedExpenses;
    }

    private async createExpenseDTO(
        text: string,
        currencyName: string,
        expenseNumber: number,
        uploadedFile: File,
    ): Promise<Omit<ExpenseDTO, '_id' | 'id_user'>> {
        const expenseObject = await this.extractWordsUntilSymbol(
            text,
            currencyName,
        );
        const expenseCategory =
            expenseObject === ''
                ? 'General'
                : await this.classifyExpense(expenseObject);
        const amounts = await this.extractNumbers(text);

        return {
            name: expenseObject + expenseNumber,
            amount: amounts[amounts.length - 1],
            description: '',
            id_category:
                await this.categoryService.getCategoryID(expenseCategory),
            id_files: [await this.getFileID(uploadedFile.filename)],
            id_currency: await this.currencyService.getCurrencyID(currencyName),
            date: new Date(),
        };
    }

    async doOCR(
        data: Buffer,
        filename: string,
    ): Promise<Omit<ExpenseDTO, '_id' | 'id_user'>[]> {
        const resultedText = await this.extractTextFromImage(data);
        if (!resultedText) {
            console.log('No text could be retrieved from the receipt!');
            return [];
        }

        const resultedTextParts = this.tokenizeText(resultedText);
        if (resultedTextParts.length === 0) {
            console.log('Text parts could not be retrieved!');
            return [];
        }

        const currencyName = await this.detectCurrency(resultedTextParts);
        if (currencyName === 'No currency found') {
            console.log('Currency could not be retrieved!');
            return [];
        }

        const uploadedFile = await this.findFileByFilename(filename);
        return this.processExpenses(
            resultedTextParts,
            currencyName,
            uploadedFile,
        );
    }

    async delete(id: string, userId: string): Promise<void> {
        const findResult = await this.fileModel.findById(id);

        if (!findResult) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }

        if (findResult.id_user !== userId) {
            throw new BadRequestException('This file was not uploaded by you!');
        }

        await this.fileModel.findByIdAndDelete(id);

        const expenses = await this.expenseService.getAll<ExpenseDTO>(userId);

        expenses.forEach((element) => {
            if (element.id_files.includes(id)) {
                element.id_files.filter((id_file) => id_file !== id);
            }

            this.fileModel.findByIdAndUpdate(element._id, element);
        });
    }
}
