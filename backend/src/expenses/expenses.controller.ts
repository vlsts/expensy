import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expenses.schema';


@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expenseService: ExpensesService) {}

  @Get()
  findAll(): string {
    return 'This action returns all expenses';
  }

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
      return this.expenseService.create(createExpenseDto);
  }
}
