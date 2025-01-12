import { IsString, IsOptional, IsArray, IsDate } from 'class-validator';
import { IsFloat } from '../../constraints/float.constraint';
import { IsStringOrUUID } from '../../constraints/string.or.UUID.constraint';

export class UpdateExpenseDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsFloat()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    id_currency?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    id_files?: string[];

    @IsStringOrUUID()
    @IsOptional()
    id_category?: string;

    @IsDate()
    @IsOptional()
    date?: Date;
}
