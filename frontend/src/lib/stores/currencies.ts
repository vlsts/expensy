import { writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Currency } from '$lib/types/api.types';

interface CurrenciesState {
    items: Currency[];
    loading: boolean;
    error: string | null;
}

function createFilesStore() {
    const { subscribe, set, update } = writable<CurrenciesState>({
        items: [],
        loading: false,
        error: null
    });

    return {
        subscribe,
        fetchCurrencies: async () => {
            update(state => ({ ...state, loading: true, error: null }));
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/currencies`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch curencies');
                const data = await response.json();
                update(state => ({ ...state, items: data, loading: false }));
            } catch (error) {
                update(state => ({ ...state, error: error?.message, loading: false }));
            }
        }
    };
}

export const currencies = createFilesStore();