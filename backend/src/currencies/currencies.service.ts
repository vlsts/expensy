import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from './currencies.schema';
import { Service } from '../base/service';

@Injectable()
export class CurrenciesService extends Service<Currency> {
    constructor(
        @InjectModel(Currency.name)
        private currencyModel: Model<CurrencyDocument>,
    ) {
        super(currencyModel);
        this.initializeIfEmpty(`${__dirname}/currencies.default.json`, [
            'shortname',
        ]);
    }

    override async getAll<T>(): Promise<T[]> {
        return (
            await this.currencyModel
                .find<T>()
                .exec()
        );
    }

    async getCurrencyID(shortname: string): Promise<string> {
        switch (shortname) {
            case '$':
                shortname = 'USD';
                break;
            case '€':
                shortname = 'EUR';
                break;
            case '£':
                shortname = 'GBP';
                break;
            case '¥':
                shortname = 'JPY';
                break;
            case '₹':
                shortname = 'INR';
                break;
            default:
                break;
        }

        return (
            await this.currencyModel.findOne({ shortname }).exec()
        )._id.toString();
    }
}
