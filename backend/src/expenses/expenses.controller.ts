import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expenses.schema';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '../guards/auth.guard';
import { GetExpenseDto } from './dto/get-expense.dto';

@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expenseService: ExpensesService) {}

    @Get()
    async findAll(@Request() request): Promise<GetExpenseDto[]> {
        const expenses = await this.expenseService.getAll(request.userId);

        return expenses;
    }

    @Post()
    async create(@Body() createExpenseDto: CreateExpenseDto, @Request() request): Promise<Expense> {
        return this.expenseService.create(createExpenseDto, request.userId);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateExpenseDto: UpdateExpenseDto,
    ): Promise<Expense> {
        return this.expenseService.update(id, updateExpenseDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() request): Promise<void> {
        return this.expenseService.delete(id, request.userId);
    }
}
