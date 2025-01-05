import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from './currencies.schema';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Injectable()
export class CurrenciesService {
    constructor(@InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>) {}

    async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
        const newCurrency = new this.currencyModel(createCurrencyDto);
        return newCurrency.save();
    }
}