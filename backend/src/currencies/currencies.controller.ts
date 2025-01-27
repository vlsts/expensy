import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrencyDTO } from './currencies.schema';

@UseGuards(AuthGuard)
@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currencyService: CurrenciesService) { }

    @Get()
    async getAll(
        @Request() request,
    ): Promise<Omit<CurrencyDTO, '_id' | 'id_user'>[]> {
        const currencies = await this.currencyService.getAll<
            Omit<CurrencyDTO, '_id' | 'id_user'>
        >(request.userId);

        return currencies;
    }
}
