import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    mime_type: string;
}
