import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { AuthGuard } from '../guards/auth.guard';
import { GetCurrencyDTO } from './currencies.schema';

@UseGuards(AuthGuard)
@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currencyService: CurrenciesService) {}

    @Get()
    async findAll(): Promise<Omit<GetCurrencyDTO, 'id_currency'>[]> {
        const currencies = await this.currencyService.getAll();

        return currencies;
    }
}
