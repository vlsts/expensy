import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    id_currency: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    id_files: string[];

    @Prop({ required: true })
    id_category: string;

    @Prop({ required: true })
    id_user: string;

    @Prop({ required: true })
    date: Date;
}

export class ExpenseDTO extends Expense {
    @IsString()
    _id?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
