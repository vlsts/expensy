import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class GetFileDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsNumber()
    @IsNotEmpty()
    size: number;

    @IsString()
    @IsNotEmpty()
    mime_type: string;
}