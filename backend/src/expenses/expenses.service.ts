import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from './expenses.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(@InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>) {}

    async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const newExpense = new this.expenseModel(createExpenseDto);
        return newExpense.save();
    }
}