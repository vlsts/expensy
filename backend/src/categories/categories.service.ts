import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { CategoryDTO } from './categories.schema';
import { Service } from '../base/service';

@Injectable()
export class CategoriesService extends Service<Category> {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
    ) {
        super(categoryModel);
        this.initializeIfEmpty(`${__dirname}/categories.default.json`, [
            'name',
            'id_user',
        ]);
    }

    override async getAll<TGetDto>(userId: string): Promise<TGetDto[]> {
        let categories: Omit<CategoryDTO, 'id_user'>[] = [];

        const defaultCategories = await this.categoryModel.find({
            id_user: '00000000-0000-0000-0000-000000000000',
        });

        const userCategories = await this.categoryModel.find({
            id_user: userId,
        });

        categories = [
            ...defaultCategories.map((category) => {
                return {
                    id_icon: category.id_icon,
                    color: category.color,
                    name: category.name,
                    _id: category._id.toString(),
                };
            }),
            ...userCategories.map((category) => {
                return {
                    id_icon: category.id_icon,
                    color: category.color,
                    name: category.name,
                    _id: category._id.toString(),
                };
            }),
        ];

        return categories as TGetDto[];
    }

    async getCategoryID(name: string): Promise<string> {
        return (
            await this.categoryModel.findOne({ name }).exec()
        )._id.toString();
    }
}
