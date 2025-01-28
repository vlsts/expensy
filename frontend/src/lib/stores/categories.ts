import type { Category } from '$lib/types/api.types';
import { Store } from './store';

class CategoriesStore extends Store<Category> {
    async fetchCategories() {
        this.updateState({ loading: true, error: null });
        try {
            const categories = await this.apiCall<Category[]>('/categories');
            this.updateState({ items: categories!, loading: false });
        } catch (error) {
            this.updateState({
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false
            });
        }
    }

    async createCategory(category: Omit<Category, '_id'>) {
        this.updateState({ loading: true, error: null });
        try {
            const created = await this.apiCall<Category>('/categories', true, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });

            this.update(state => ({
                ...state,
                items: [...state.items, created!],
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
            await this.apiCall(`/categories/${id}`, false, { method: 'DELETE' });

            this.update(state => ({
                ...state,
                items: state.items.filter(item => item._id !== id),
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
