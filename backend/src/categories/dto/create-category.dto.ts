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

    constructor(name, id_icon, id_user, color){
        this.name = name;
        this.id_icon = id_icon;
        this.id_user = id_user;
        this.color = color;
    }
}