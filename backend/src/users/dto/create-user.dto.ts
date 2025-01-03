import { IsString, IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsInt()
    @IsNotEmpty()
    id_corbado: number;

    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}