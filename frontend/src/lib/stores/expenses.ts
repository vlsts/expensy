import type { Expense } from '$lib/types/api.types';
import { Store } from './store';

class ExpensesStore extends Store<Expense> {
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
