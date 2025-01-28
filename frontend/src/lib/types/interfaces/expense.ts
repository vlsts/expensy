export interface Expense {
    _id: string;
    name: string;
    amount: number;
    id_currency: string;
    description: string;
    id_files: string[];
    id_category: string;
    date: Date;
}
