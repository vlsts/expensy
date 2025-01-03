import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    id_icon: string;

    @IsUUID()
    @IsString()
    @IsNotEmpty()
    id_user: string;

    @IsString()
    @IsNotEmpty()
    color: string;
}
