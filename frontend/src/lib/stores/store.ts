import { writable, type Writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import Corbado from '@corbado/web-js';

export interface State<T> {
    items: T[];
    loading: boolean;
    error: string | null;
}

export class Store<T> implements Writable<State<T>> {
    protected readonly store = writable<State<T>>({
        items: [],
        loading: false,
        error: null
    });

    readonly subscribe = this.store.subscribe;
    readonly set = this.store.set;
    readonly update = this.store.update;

    protected async apiCall<T2>(
        url: string, 
        options: RequestInit = {}
    ): Promise<T2> {
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

    protected updateState(partial: Partial<State<T>>) {
        this.update(state => ({ ...state, ...partial }));
    }
}

export const store = new Store();
