import { IsString, IsNotEmpty } from 'class-validator';
import { IsStringOrUUID } from '../../constraints/string.or.UUID.constraint';

export class CreateCurrencyDto {
    @IsStringOrUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    shortname: string;
}
