import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type CurrencyDocument = HydratedDocument<Currency>;

@Schema()
export class Currency {
    @Prop({required: true})
    shortname: string;
}

export class CurrencyDTO extends Currency {
    @IsNotEmpty()
    @IsString()
    id_currency: string;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
