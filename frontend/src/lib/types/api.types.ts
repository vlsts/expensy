export interface Expense {
    id_expense: string;
    name: string;
    amount: number;
    id_currency: string;
    description: string;
    id_files: string[];
    id_category: string;
    date: Date;
}

export interface Category {
    id_category: string;
    name: string;
    id_icon: string;
    color: string;
}

export interface Currency {
    shortname: string;
}

export interface File {
    id?: string;
    filename: string;
    mime_type: string;
    size?: number;
    data?: Buffer;
    doOCR?: boolean;
}