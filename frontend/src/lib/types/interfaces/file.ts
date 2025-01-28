export interface File {
    _id?: string;
    filename: string;
    mime_type: string;
    size?: number;
    data?: Buffer;
    doOCR?: boolean;
}
