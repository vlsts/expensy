import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyDocument = HydratedDocument<Currency>;

@Schema()
export class Currency {
    @Prop({required: true})
    shortname: string;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
