import { IsString, IsNotEmpty } from 'class-validator';
import { IsStringOrUUID } from 'src/constraints/string.or.UUID.constraint';

export class GetCategoryDto {
    @IsStringOrUUID()
    @IsNotEmpty()
    id_category: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    id_icon: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    id_user: string;
}
