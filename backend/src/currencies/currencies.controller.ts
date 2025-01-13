import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { GetCurrencyDto } from './dto/get-currency.dto';

@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currencyService: CurrenciesService) {}

    @Get()
    async findAll(@Request() request): Promise<GetCurrencyDto[]> {
        const currencies = await this.currencyService.getAll(request.userId);

        return currencies;
    }
}
