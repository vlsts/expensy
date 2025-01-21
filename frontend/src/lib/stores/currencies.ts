import { writable, type Writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Currency } from '$lib/types/api.types';

interface CurrenciesState {
    items: Currency[];
    loading: boolean;
    error: string | null;
}

class CurrenciesStore implements Writable<CurrenciesState> {
    private readonly store = writable<CurrenciesState>({
        items: [],
        loading: false,
        error: null
    });

    readonly subscribe = this.store.subscribe;
    readonly set = this.store.set;
    readonly update = this.store.update;

    private async apiCall<T>(
        url: string, 
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${PUBLIC_BACKEND_URL}${url}`, {
            ...options,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return response.json();
    }

    private updateState(partial: Partial<CurrenciesState>) {
        this.update(state => ({ ...state, ...partial }));
    }

    async fetchCurrencies() {
        this.updateState({ loading: true, error: null });
        try {
            const data = await this.apiCall<Currency[]>('/currencies');
            this.updateState({ items: data, loading: false });
        } catch (error) {
            this.updateState({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            });
        }
    }
}

export const currencies = new CurrenciesStore();