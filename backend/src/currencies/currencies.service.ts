import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from './currencies.schema';
import { readFile } from 'fs/promises';
import { GetCurrencyDto } from './dto/get-currency.dto';

@Injectable()
export class CurrenciesService {
    constructor(
        @InjectModel(Currency.name)
        private currencyModel: Model<CurrencyDocument>,
    ) {
        this.initializeIfEmpty();
    }

    async getAll(userId: string): Promise<GetCurrencyDto[]> {
        let currencies: GetCurrencyDto[] = [];

        const defaultCurrencies = await this.currencyModel.find({
            id_user: '00000000-0000-0000-0000-000000000000',
        });

        const userCurrencies = await this.currencyModel.find({
            id_user: userId,
        });

        currencies = [
            ...defaultCurrencies.map((category) => {
                return {
                    shortname: category.shortname,
                };
            }),
            ...userCurrencies.map((category) => {
                return {
                    shortname: category.shortname,
                };
            }),
        ];

        return currencies;
    }

    async initializeIfEmpty() {
        try {
            const data = await readFile(
                `${__dirname}/currencies.default.json`,
                'utf8',
            );
            const jsonData: Currency[] = JSON.parse(data);
            for (const currency of jsonData) {
                const result = await this.currencyModel.updateOne(
                    { shortname: currency.shortname },
                    { $setOnInsert: currency },
                    { upsert: true },
                );

                if (result.upsertedCount > 0) {
                    console.log('Currency inserted:', currency.shortname);
                } else {
                    console.log('Currency already exists:', currency.shortname);
                }
            }
        } catch (error) {
            console.error('Error inserting document:', error);
        }
    }
}
