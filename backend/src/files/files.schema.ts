import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
    @Prop({ required: true })
    id_user: string;

    @Prop({ required: true })
    data: Buffer;

    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true })
    mime_type: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
