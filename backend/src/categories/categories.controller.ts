import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './categories.schema';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {}

    @Get()
    findAll(): string {
        return 'This action returns all categories';
    }

    @Post()
    async create(@Body() createCatDto: CreateCategoryDto): Promise<Category> {
        return this.categoryService.create(createCatDto);
    }
}
