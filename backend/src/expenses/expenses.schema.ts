import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
    @Prop()
    name: string;

    @Prop()
    amount: number;

    @Prop()
    id_currency: string;

    @Prop()
    description: string;

    @Prop()
    id_files: string[];

    @Prop()
    id_category: string;

    @Prop()
    id_user: string;

    @Prop()
    date: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
