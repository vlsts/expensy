import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    mime_type: string;

    @IsBoolean()
    @IsNotEmpty()
    doOCR: boolean;
}
