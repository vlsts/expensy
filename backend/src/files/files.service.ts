import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './files.schema';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto';
import { ExpensesService } from 'src/expenses/expenses.service';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { RegexpTokenizer } from 'natural';
import { promises as fs } from 'fs';
import { GetFileDto } from './dto/get-file.dto';
import { HfInference } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';
import { CategoriesService } from 'src/categories/categories.service';

let Tesseract = require('tesseract.js');
let natural = require('natural');

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        @Inject(forwardRef(() => CurrenciesService)) private currencyService: CurrenciesService,
        @Inject(forwardRef(() => ExpensesService)) private expenseService: ExpensesService,
        @Inject(forwardRef(() => CategoriesService)) private categoryService: CategoriesService,
        private configService: ConfigService,
    ) {}

    async create(
        createFileDto: CreateFileDto,
        fileBuffer: Buffer,
        size: number,
        userId: string,
    ) {
        const newFile = new this.fileModel({
            ...createFileDto,
            data: fileBuffer,
            size,
            id_user: userId,
        });

        newFile.save();

        if (createFileDto.doOCR) {
            const addedExpenses: CreateExpenseDto[] = await this.doOCR(
                fileBuffer,
                newFile.filename,
            );

            return addedExpenses;
        }
    }

    async findAll(userId: string): Promise<GetFileDto[]> {
        let files = await this.fileModel
            .find({
                id_user: userId,
            })
            .exec();

        return files.map((f) => ({
            id: f._id.toString(),
            filename: f.filename,
            size: f.size,
            mime_type: f.mime_type,
        }));
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
        const escapedSymbol = this.escapeRegExp(symbol);

        const regex = new RegExp(`(.*?)${escapedSymbol}`, 's');

        const match = input.match(regex);

        if (match) {
            const words: string = match[1].trim().split(/\s+/).join(' ');
            return words;
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

    async doOCR(data: Buffer, filename: string): Promise<CreateExpenseDto[]> {
        let recog = await Tesseract.recognize(data, 'eng');
        let resultedText = recog.data.text;

        if (resultedText === '') {
            console.log('No text could be retrieved from the receipt!');
            return [];
        }

        let tokenizer: RegexpTokenizer = new natural.RegexpTokenizer({
            pattern: /((?:\$|€|£|¥|₹|[A-Z]{3})\s*\d+(?:\s?(?:\.|,)\d+)?)/g,
        });

        let resultedTextParts = tokenizer.tokenize(resultedText);

        
        resultedTextParts = resultedText
        .split(/(\n)/)
        .filter((line) => line.trim() !== '');
        
        if (resultedTextParts.length === 0) {
            console.log('Text parts could not be retrieved!');
            return [];
        }

        const currencyName: string =
            await this.detectCurrency(resultedTextParts);

        if (currencyName === 'No currency found') {
            console.log('Currency could not be retrieved!');
            return [];
        }

        const uploadedFile: File = await this.findFileByFilename(filename);

        let addedExpenses: CreateExpenseDto[] = [];
        let expenseNumber: number = 0;
        let index: number = 0;

        while (index <= resultedTextParts.length - 1) {
            let insideWhile = false;
            while (!resultedTextParts[index].includes(currencyName)) {
                index++;

                if (index > resultedTextParts.length - 1) {
                    insideWhile = true;
                    break;
                }
            }
            if (insideWhile) break;
            let expenseObject: string = await this.extractWordsUntilSymbol(
                resultedTextParts[index],
                currencyName,
            );

            let expenseCategory: string =
                expenseObject === ''
                    ? 'General'
                    : await this.classifyExpense(expenseObject);

            let expenseToAdd: CreateExpenseDto = new CreateExpenseDto();
            let amounts = await this.extractNumbers(resultedTextParts[index]);
            expenseToAdd.name = expenseObject + expenseNumber;
            expenseToAdd.amount = amounts[amounts.length - 1];
            expenseToAdd.description = '';
            expenseToAdd.id_category = await this.categoryService.getCategoryID(expenseCategory);
            expenseToAdd.id_files = [await this.getFileID(filename)];
            expenseToAdd.id_currency =
                await this.currencyService.getCurrencyID(currencyName);
            expenseToAdd.date = new Date().toString();

            this.expenseService.create(expenseToAdd, uploadedFile.id_user);

            addedExpenses.push(expenseToAdd);

            expenseNumber++;
            index++;
        }

        return addedExpenses;
    }
}
