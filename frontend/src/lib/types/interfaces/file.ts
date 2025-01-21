export interface File {
    id?: string;
    filename: string;
    mime_type: string;
    size?: number;
    data?: Buffer;
    doOCR?: boolean;
}