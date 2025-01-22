import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
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

export class FilesDTO extends File {
    @IsNotEmpty()
    @IsString()
    id_file: string;
}

export type CreateFileDTO = Omit<File, 'id_user' | 'size' | 'data'> & { doOCR: boolean };

export type GetFileDTO = Omit<FilesDTO, 'id_user' | 'data'>;

export const FileSchema = SchemaFactory.createForClass(File);
