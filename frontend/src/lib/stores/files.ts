import type { File as FileAPI } from '$lib/types/api.types';
import { Store } from './store';

interface FileMetadata {
    filename: string;
    mime_type: string;
    doOCR: boolean;
    data?: string;
    size?: number
}

class FilesStore extends Store<FileAPI> {
    async fetchFiles() {
        this.updateState({ loading: true, error: null });
        try {
            const files = await this.apiCall<FileAPI[]>('/files', true);
            this.updateState({ items: files!, loading: false });
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
            metadata.data = file.name;
            metadata.size = file.size;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('createFileDto', JSON.stringify(metadata));

            const uploadedFile = await this.apiCall<FileAPI>('/files/upload', true, {
                method: 'POST',
                body: formData
            });

            this.update(state => ({
                ...state,
                items: [...state.items, uploadedFile!],
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
            await this.apiCall(`/files/${id}`, false, { method: 'DELETE' });

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

export const files = new FilesStore();
