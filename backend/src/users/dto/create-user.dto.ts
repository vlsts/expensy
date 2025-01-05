import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { IsStringOrUUID } from '../../constraints/string.or.UUID.constraint';

export class CreateUserDto {
    @IsStringOrUUID()
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
