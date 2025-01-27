import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    id_icon: string;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    id_user: string;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    color: string;
}

export class CategoryDTO extends Category {
    @IsNotEmpty()
    @IsString()
    _id: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
