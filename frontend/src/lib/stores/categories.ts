import { writable, type Writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Category } from '$lib/types/api.types';
import Corbado from '@corbado/web-js';

interface CategoriesState {
    items: Category[];
    loading: boolean;
    error: string | null;
}

class CategoriesStore implements Writable<CategoriesState> {
    private readonly store = writable<CategoriesState>({
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

    private updateState(partial: Partial<CategoriesState>) {
        this.update(state => ({ ...state, ...partial }));
    }

    async fetchCategories() {
        this.updateState({ loading: true, error: null });
        try {
            const categories = await this.apiCall<Category[]>('/categories');
            this.updateState({ items: categories, loading: false });
        } catch (error) {
            this.updateState({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            });
        }
    }

    async createCategory(category: Omit<Category, 'id_category'>) {
        this.updateState({ loading: true, error: null });
        try {
            const created = await this.apiCall<Category>('/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });

            this.update(state => ({
                ...state,
                items: [...state.items, created],
                loading: false
            }));

            return created;
        } catch (error) {
            this.updateState({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            });
            throw error;
        }
    }

    async deleteCategory(id: string) {
        this.updateState({ loading: true, error: null });
        try {
            await this.apiCall(`/categories/${id}`, { method: 'DELETE' });
            
            this.update(state => ({
                ...state,
                items: state.items.filter(item => item.id_category !== id),
                loading: false
            }));
        } catch (error) {
            this.updateState({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            });
            throw error;
        }
    }
}

export const categories = new CategoriesStore();