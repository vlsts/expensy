import { IsString, IsNotEmpty, IsArray, IsDate } from 'class-validator';
import { IsFloat } from '../../constraints/float.constraint';
import { IsStringOrUUID } from '../../constraints/string.or.UUID.constraint';

export class GetExpenseDto {
    @IsStringOrUUID()
    @IsNotEmpty()
    id_expense: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsFloat()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    id_currency: string;

    @IsString()
    description: string;

    @IsArray()
    @IsString({ each: true })
    id_files: string[];

    @IsStringOrUUID()
    @IsNotEmpty()
    id_category: string;

    @IsDate()
    @IsNotEmpty()
    date: Date;
}
