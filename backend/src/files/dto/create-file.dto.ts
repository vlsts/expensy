import { IsString, IsNotEmpty } from 'class-validator';
import { IsStringOrUUID } from '../../constraints/string.or.UUID.constraint';

export class CreateFileDto {
    @IsStringOrUUID()
    @IsNotEmpty()
    id_user: string;

    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    mime_type: string;
}
