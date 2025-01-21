import { writable, type Writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Expense } from '$lib/types/api.types';
import Corbado from '@corbado/web-js';

interface ExpensesState {
    items: Expense[];
    loading: boolean;
    error: string | null;
}

class ExpensesStore implements Writable<ExpensesState> {
    private readonly store = writable<ExpensesState>({
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
            headers: {
                'Authorization': `Bearer ${Corbado.sessionToken}`
            },
            ...options,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return response.json();
    }

    private updateState(partial: Partial<ExpensesState>) {
        this.update(state => ({ ...state, ...partial }));
    }

    async fetchExpenses() {
        this.updateState({ loading: true, error: null });
        try {
            const data = await this.apiCall<Expense[]>('/expenses');
            this.updateState({ items: data, loading: false });
        } catch (error) {
            this.updateState({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            });
        }
    }

    async createExpense(expense: Omit<Expense, 'id_expense'>) {
        this.updateState({ loading: true, error: null });
        try {
            const created = await this.apiCall<Expense>('/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });
            
            this.store.update(state => ({
                ...state,
                items: [...state.items, created],
                loading: false
            }));
        } catch (error) {
            this.updateState({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            });
        }
    }

    async deleteExpense(id: string) {
        this.updateState({ loading: true, error: null });
        try {
            await this.apiCall(`/expenses/${id}`, { method: 'DELETE' });
            
            this.store.update(state => ({
                ...state,
                items: state.items.filter(item => item.id_expense !== id),
                loading: false
            }));
        } catch (error) {
            this.updateState({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            });
        }
    }
}

export const expenses = new ExpensesStore();