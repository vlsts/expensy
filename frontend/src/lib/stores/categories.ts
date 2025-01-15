import { writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Category } from '$lib/types/api.types';

interface CategoriesState {
    items: Category[];
    loading: boolean;
    error: string | null;
}

function createCategoriesStore() {
    const { subscribe, set, update } = writable<CategoriesState>({
        items: [],
        loading: false,
        error: null
    });

    return {
        subscribe,
        fetchCategories: async () => {
            update(state => ({ ...state, loading: true, error: null }));
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/categories`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                update(state => ({ ...state, items: data, loading: false }));
            } catch (error) {
                update(state => ({ ...state, error: error?.message, loading: false }));
            }
        },
        createCategory: async (category: Omit<Category, 'id_category'>) => {
            update(state => ({ ...state, loading: true, error: null }));
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/categories`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(category)
                });
                if (!response.ok) throw new Error('Failed to create category');
            } catch (error) {
                update(state => ({ ...state, error: error?.message, loading: false }));
            }
        }
    };
}

export const categories = createCategoriesStore();