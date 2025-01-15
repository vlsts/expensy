import { writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Expense } from '$lib/types/api.types';

interface ExpensesState {
    items: Expense[];
    loading: boolean;
    error: string | null;
}

function createExpensesStore() {
    const { subscribe, set, update } = writable<ExpensesState>({
        items: [],
        loading: false,
        error: null
    });

    return {
        subscribe,
        fetchExpenses: async () => {
            update(state => ({ ...state, loading: true, error: null }));
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/expenses`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch expenses');
                const data = await response.json();
                update(state => ({ ...state, items: data, loading: false }));
            } catch (error) {
                update(state => ({ ...state, error: error?.message, loading: false }));
            }
        },
        createExpense: async (expense: Omit<Expense, 'id_expense'>) => {
            update(state => ({ ...state, loading: true, error: null }));
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/expenses`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(expense)
                });
                if (!response.ok) throw new Error('Failed to create expense');
            } catch (error) {
                update(state => ({ ...state, error: error?.message, loading: false }));
            }
        },
        deleteExpense: async (id: string) => {
            update(state => ({ ...state, loading: true, error: null }));
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/expenses/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to delete expense');
                update(state => ({
                    ...state,
                    items: state.items.filter(expense => expense.id_expense !== id),
                    loading: false
                }));
            } catch (error) {
                update(state => ({ ...state, error: error?.message, loading: false }));
            }
        }
    };
}

export const expenses = createExpensesStore();