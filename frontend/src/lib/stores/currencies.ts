import type { Currency } from '$lib/types/api.types';
import { Store } from './store';

class CurrenciesStore extends Store<Currency> {
    async fetchCurrencies() {
        this.updateState({ loading: true, error: null });
        try {
            const data = await this.apiCall<Currency[]>('/currencies');
            this.updateState({ items: data!, loading: false });
        } catch (error) {
            this.updateState({
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false
            });
        }
    }
}

export const currencies = new CurrenciesStore();
