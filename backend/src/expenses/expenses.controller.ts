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
import { ExpenseDTO, Expense } from './expenses.schema';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expenseService: ExpensesService) {}

    @Get()
    async findAll(@Request() request): Promise<Omit<ExpenseDTO, 'id_user'>[]> {
        const expenses = await this.expenseService.getAll(request.userId);

        return expenses;
    }

    @Post()
    async create(@Body() createExpenseDto: Omit<ExpenseDTO, 'id_expense' | 'id_user'>, @Request() request): Promise<Expense> {
        return this.expenseService.create(createExpenseDto, request.userId);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateExpenseDto: Partial<ExpenseDTO>,
    ): Promise<Expense> {
        return this.expenseService.update(id, updateExpenseDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() request): Promise<void> {
        return this.expenseService.delete(id, request.userId);
    }
}
