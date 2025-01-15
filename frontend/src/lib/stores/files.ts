import { writable, get } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type {  } from '$lib/types/api.types';
interface FilesState {
    items: File[];
    loading: boolean;
    error: string | null;
}

interface FileMetadata {
    filename: string;
    mime_type: string;
    doOCR: boolean;
}

function createFilesStore() {
    const { subscribe, set, update } = writable<FilesState>({
        items: [],
        loading: false,
        error: null
    });

    return {
        subscribe,
        fetchFiles: async () => {
            update(currentState => ({ ...currentState, loading: true, error: null }));
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/files`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch file');
                
                const files: File[] = await response.json();
                
                update(currentState => ({
                    ...currentState,
                    items: files,
                    loading: false
                }));
            } catch (error) {
                update(currentState => ({
                    ...currentState,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    loading: false
                }));
            }
        },
        uploadFile: async (file: File, doOCR: boolean) => {
            update(state => ({ ...state, loading: true, error: null }));
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('createFileDto', JSON.stringify({
                filename: file.name,
                mime_type: file.type,
                doOCR
            }));
            
            try {
                const response = await fetch(`${PUBLIC_BACKEND_URL}/files/upload`, {
                    method: 'POST',
                    credentials: 'include',
                    // Don't set Content-Type header, browser will set it automatically with boundary
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Upload failed');
                }
            } catch (error) {
                update(state => ({
                    ...state,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    loading: false
                }));
                throw error;
            }
        }
    };
}

export const files = createFilesStore();