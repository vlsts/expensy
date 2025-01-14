import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './files.schema';
import { CreateFileDto } from './dto/create-file.dto';
import { OcrService } from 'src/ocr/ocr.service';
import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { RegexpTokenizer } from 'natural';
import { promises as fs } from 'fs';

import Tesseract from 'tesseract.js';
import natural from 'natural';
import { ExpensesService } from 'src/expenses/expenses.service';

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        private currencyService: CurrenciesService,
        private expenseService: ExpensesService
    ) {}

    async create(
        createFileDto: CreateFileDto,
        fileBuffer: Buffer,
        size: number,
    ) {
        const newFile = new this.fileModel({
            ...createFileDto,
            data: fileBuffer,
            size,
        });

        newFile.save()

        if (createFileDto.doOCR) {
            const addedExpenses: CreateExpenseDto[] = await this.doOCR(fileBuffer, newFile.filename);

            return addedExpenses;
        }
    }

    async findAll(): Promise<File[]> {
        return this.fileModel.find().exec();
    }

    async findFileById(id: string): Promise<File | null> {
        return this.fileModel.findById(id).exec();
    }

    async findFileByFilename(filename: string): Promise<File | null> {
        return this.fileModel.findOne({ filename }).exec();
    }

    async getFileID(filename: string): Promise<string> {
        return (await this.fileModel.findOne({filename}).exec())._id.toString();
    }

    async detectCurrency(words: string[]): Promise<string> {
        const currencies = await fs.readFile(
            `backend\\src\\currencies\\currencies.default.json`,
            'utf8',
        );
    
        const currenciesParsed = JSON.parse(currencies);

        const shortnames = currenciesParsed.map(currency => currency.shortname).join('|');
        const currencyCodePattern = new RegExp(`\\b(?:${shortnames})\\b`, 'i');
    
        const currencyPatterns = [
            /\$|€|£|¥|₹/,
            currencyCodePattern
        ];
    
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
            return matches.map(match => {
                const normalizedMatch = match.replace(',', '.');
                return parseFloat(normalizedMatch);
            });
        }
    
        return [];
    }

    async escapeRegExp(symbol: string): Promise<string> {
        return symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    async extractWordsUntilSymbol(input: string, symbol: string): Promise<string> {
        const escapedSymbol = this.escapeRegExp(symbol);
        
        const regex = new RegExp(`(.*?)${escapedSymbol}`, 's'); // Match everything up to the first occurrence of the symbol
    
        const match = input.match(regex);
    
        if (match) {
            const words: string = match[1].trim().split(/\s+/).join(' '); // Split by whitespace
            return words;
        }
    
        return "";
    }

    async doOCR(data: Buffer, filename: string): Promise<CreateExpenseDto[]> {
        let resultedText = (await Tesseract.recognize(data, "eng")).data.text;

        if (resultedText === "") {
            console.log("No text could be retrieved from the receipt!")
            return [];
        }

        let tokenizer: RegexpTokenizer = new natural.RegexpTokenizer({pattern: /((?:\$|€|£|¥|₹|[A-Z]{3})\s*\d+(?:\s?(?:\.|,)\d+)?)/g});
        
        let resultedTextParts = tokenizer.tokenize(resultedText);

        resultedTextParts = resultedText.split(/(\n)/).filter(line => line.trim() !== '');

        if (resultedTextParts.length === 0) {
            console.log("Text parts could not be retrieved!")
            return [];
        }

        const currencyName: string = await this.detectCurrency(resultedTextParts);

        if (currencyName === 'No currency found') {
            console.log("Currency could not be retrieved!")
            return [];
        }

        const uploadedFile: File = await this.findFileByFilename(filename);

        let addedExpenses: CreateExpenseDto[] = [];
        let expenseNumber: number = 0;
        let index: number = 0;

        while(index <= resultedTextParts.length - 1) {
            while (!resultedTextParts[index].includes(currencyName)) {
                index ++;

                if (index > resultedTextParts.length) {
                    break;
                }
            } 
            
            let expenseObject: string = await this.extractWordsUntilSymbol(resultedTextParts[index], currencyName)

            let expenseToAdd = new CreateExpenseDto();

            expenseToAdd.name = expenseObject + expenseNumber;
            expenseToAdd.amount = (await this.extractNumbers(resultedTextParts[index]))[-1];
            expenseToAdd.description = "";
            expenseToAdd.id_category = ""; // TODO: Finish here
            expenseToAdd.id_files = [await this.getFileID(filename)];
            expenseToAdd.id_currency = await this.currencyService.getCurrencyID(currencyName);

            this.expenseService.create(expenseToAdd, uploadedFile.id_user)

            addedExpenses.push(expenseToAdd);

            expenseNumber++;
        }

        return addedExpenses;
    }
}
