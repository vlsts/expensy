import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { readFile } from 'fs/promises';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
        this.initializeIfEmpty();
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const newCategory = new this.categoryModel(createCategoryDto);
        return newCategory.save();
    }

    async initializeIfEmpty() {
        try {
            const data = await readFile(`${__dirname}/categories.default.json`, 'utf8');
            const jsonData: CreateCategoryDto[] = JSON.parse(data);
            for (const category of jsonData) {
                const result = await this.categoryModel.updateOne(
                    { name: category.name, id_user: category.id_user },
                    { $setOnInsert: category },
                    { upsert: true }
                );

                if (result.upsertedCount > 0) {
                    console.log('Category inserted:', category.name);
                } else {
                    console.log('Category already exists:', category.name);
                }
            }
        } catch (error) {
            console.error('Error inserting document:', error);
        }
    }
}
