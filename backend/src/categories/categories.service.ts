import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { readFile } from 'fs/promises';
import { GetCategoryDto } from './dto/get-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
    ) {
        this.initializeIfEmpty();
    }

    async create(
        createCategoryDto: CreateCategoryDto,
        userId: string,
    ): Promise<Category> {
        const category: Category = {
            ...createCategoryDto,
            id_user: userId,
        };
        const newCategory = new this.categoryModel(category);
        return newCategory.save();
    }

    async getAll(userId: string): Promise<GetCategoryDto[]> {
        let categories: GetCategoryDto[] = [];

        const defaultCategories = await this.categoryModel.find({
            id_user: '00000000-0000-0000-0000-000000000000',
        });

        const userCategories = await this.categoryModel.find({
            id_user: userId,
        });

        categories = [
            ...defaultCategories.map((category) => {
                return {
                    id_user: category.id_user,
                    id_icon: category.id_icon,
                    color: category.color,
                    name: category.name,
                    id_category: category._id.toString(),
                };
            }),
            ...userCategories.map((category) => {
                return {
                    id_user: category.id_user,
                    id_icon: category.id_icon,
                    color: category.color,
                    name: category.name,
                    id_category: category._id.toString(),
                };
            }),
        ];

        return categories;
    }

    async initializeIfEmpty() {
        try {
            const data = await readFile(
                `${__dirname}/categories.default.json`,
                'utf8',
            );
            const jsonData: Category[] = JSON.parse(data);
            for (const category of jsonData) {
                const result = await this.categoryModel.updateOne(
                    { name: category.name, id_user: category.id_user },
                    { $setOnInsert: category },
                    { upsert: true },
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

    async delete(id: string, userId: string): Promise<void> {
        const findResult = await this.categoryModel.findById(id);

        if (!findResult) {
            throw new NotFoundException(`Expense with ID ${id} not found`);
        }

        if (findResult.id_user !== userId) {
            throw new BadRequestException(
                'This category was not created by you!',
            );
        }

        await this.categoryModel.findByIdAndDelete(id);
    }
}
