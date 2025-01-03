import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import DefaultCategories from './categories.default.json'

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
        this.initializeIfEmpty(DefaultCategories)
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const newCategory = new this.categoryModel(createCategoryDto);
        return newCategory.save();
    }

    async initializeIfEmpty(values) {
    try {
        for(let i = 0; i < values.length; i ++)
        {
            const result = await this.categoryModel.updateOne(new CreateCategoryDto(values[i].name, values[i].id_icon, values[i].id_user, values[i].color), { upsert: true });
            console.log('Operation result:', result);
        }
    } catch (error) {
        console.error('Error inserting document:', error);
    }
}

}