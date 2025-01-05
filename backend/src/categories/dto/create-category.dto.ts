import { IsString, IsNotEmpty } from 'class-validator';
import { IsStringOrUUID } from 'src/constraints/string.or.UUID.constraint';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    id_icon: string;

    @IsStringOrUUID()
    @IsNotEmpty()
    id_user: string;

    @IsString()
    @IsNotEmpty()
    color: string;
}
