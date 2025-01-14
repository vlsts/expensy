import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import { RegexpTokenizer } from "natural";
import { FilesService } from 'src/files/files.service';
import { File } from 'src/files/files.schema';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto'
import { promises as fs } from 'fs';

import Tesseract from 'tesseract.js';
import natural from "natural"

@Injectable()
export class OcrService {
    constructor(private expenseService: ExpensesService, private fileService: FilesService, private currencyService: CurrenciesService) {}

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


    async doOCR(data: Buffer, filename: string): Promise<boolean> {
        let resultedText = (await Tesseract.recognize(data, "eng")).data.text;

        if (resultedText === "") {
            return false;
        }

        let tokenizer: RegexpTokenizer = new natural.RegexpTokenizer({pattern: /((?:\$|€|£|¥|₹|[A-Z]{3})\s*\d+(?:\s?(?:\.|,)\d+)?)/g});
        
        let resultedTextParts = tokenizer.tokenize(resultedText);

        if (resultedTextParts.length === 0) {
            return false;
        }

        const currencyName: string = await this.detectCurrency(resultedTextParts);

        if (currencyName === 'No currency found') {
            return false;
        }

        const uploadedFile: File = await this.fileService.findFileByFilename(filename);

        let expenseToAdd = new CreateExpenseDto();

        expenseToAdd.name = filename;
        expenseToAdd.amount = 0; // TODO: Finish here
        expenseToAdd.description = "";
        expenseToAdd.id_category = ""; // TODO: Finish here
        expenseToAdd.id_files = [await this.fileService.getFileID(filename)];
        expenseToAdd.id_currency = await this.currencyService.getCurrencyID(currencyName);

        this.expenseService.create(expenseToAdd, uploadedFile.id_user)
    }
}
