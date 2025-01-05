import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Currency } from './currencies.schema';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currencyService: CurrenciesService) {}

    @Get()
    findAll(): string {
        return 'This action returns all currencies';
    }

    @Post()
    async create(
        @Body() createCurrencyDto: CreateCurrencyDto,
    ): Promise<Currency> {
        return this.currencyService.create(createCurrencyDto);
    }
}
