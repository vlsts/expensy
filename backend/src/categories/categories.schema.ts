import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id_icon: string;

  @Prop({ required: true })
  id_user: string;

  @Prop({ required: true })
  color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
