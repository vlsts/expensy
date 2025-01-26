import type { File as FileAPI } from '$lib/types/api.types';
import { Store } from './store';

interface FileMetadata {
    filename: string;
    mime_type: string;
    doOCR: boolean;
}

class FilesStore extends Store<FileAPI> {
    async fetchFiles() {
        this.updateState({ loading: true, error: null });
        try {
            const files = await this.apiCall<FileAPI[]>('/files');
            this.updateState({ items: files, loading: false });
        } catch (error) {
            this.updateState({
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false
            });
        }
    }

    async uploadFile(file: globalThis.File, metadata: FileMetadata) {
        this.updateState({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('createFileDto', JSON.stringify(metadata));

            const uploadedFile = await this.apiCall<FileAPI>('/files/upload', {
                method: 'POST',
                body: formData
            });

            this.update(state => ({
                ...state,
                items: [...state.items, uploadedFile],
                loading: false
            }));

            return uploadedFile;
        } catch (error) {
            this.updateState({
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false
            });
            throw error;
        }
    }

    async deleteFile(id: string) {
        this.updateState({ loading: true, error: null });
        try {
            await this.apiCall(`/files/${id}`, { method: 'DELETE' });

            this.update(state => ({
                ...state,
                items: state.items.filter(item => item.id !== id),
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

export const files = new FilesStore();
