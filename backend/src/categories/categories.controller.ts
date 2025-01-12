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
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './categories.schema';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {}

    @Get()
    async findAll(@Request() request): Promise<Category[]> {
        const categories = await this.categoryService.getAll(request.userId);

        return categories;
    }

    @Post()
    async create(
        @Body() createCatDto: CreateCategoryDto,
        @Request() request,
    ): Promise<Category> {
        return this.categoryService.create(createCatDto, request.userId);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() request): Promise<void> {
        return this.categoryService.delete(id, request.userId);
    }
}
