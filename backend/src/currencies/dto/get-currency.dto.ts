import { IsString, IsNotEmpty } from 'class-validator';

export class GetCurrencyDto {
    @IsString()
    @IsNotEmpty()
    shortname: string;
}
