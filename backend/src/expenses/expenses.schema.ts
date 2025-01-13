import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    amount: number;

    @Prop({required: true})
    id_currency: string;

    @Prop()
    description: string;

    @Prop({required: true})
    id_files: string[];

    @Prop({required: true})
    id_category: string;

    @Prop({required: true})
    id_user: string;

    @Prop({required: true})
    date: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
