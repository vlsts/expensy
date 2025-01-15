import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { GetCurrencyDto } from './dto/get-currency.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currencyService: CurrenciesService) {}

    @Get()
    async findAll(): Promise<GetCurrencyDto[]> {
        const currencies = await this.currencyService.getAll();

        return currencies;
    }
}
