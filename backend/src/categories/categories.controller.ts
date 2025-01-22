import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category, CategoryDTO } from './categories.schema';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {}

    @Get()
    async findAll(@Request() request): Promise<Omit<CategoryDTO, 'id_user'>[]> {
        const categories = await this.categoryService.getAll(request.userId);

        return categories;
    }

    @Post()
    async create(
        @Body() createCatDto: Omit<CategoryDTO, 'id_user' | 'id_category'>,
        @Request() request,
    ): Promise<Category> {
        return this.categoryService.create(createCatDto, request.userId);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() request): Promise<void> {
        return this.categoryService.delete(id, request.userId);
    }
}
