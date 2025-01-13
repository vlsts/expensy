import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from './expenses.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpenseDto } from './dto/get-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    ) { }

    async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const newExpense = new this.expenseModel(createExpenseDto);
        return newExpense.save();
    }

    async getAll(userId: string): Promise<GetExpenseDto[]> {
        let expenses: GetExpenseDto[] = await this.expenseModel.find({
            id_user: userId,
        });

        expenses = expenses.map((expense) => {
            return {
                id_expense: expense.id_expense,
                name: expense.name,
                amount: expense.amount,
                id_currency: expense.id_currency,
                description: expense.description,
                id_files: expense.id_files,
                id_category: expense.id_category,
                date: expense.date,
            };
        });

        return expenses;
    }

    async update(
        id: string,
        updateExpenseDto: UpdateExpenseDto,
    ): Promise<Expense> {
        const updatedExpense = await this.expenseModel.findByIdAndUpdate(
            id,
            updateExpenseDto,
            { new: true },
        );

        if (!updatedExpense) {
            throw new NotFoundException(`Expense with ID ${id} not found`);
        }

        return updatedExpense;
    }

    async delete(id: string, userId: string): Promise<void> {
        const findResult = await this.expenseModel.findById(id);

        if (!findResult) {
            throw new NotFoundException(`Expense with ID ${id} not found`);
        }

        if (findResult.id_user !== userId) {
            throw new BadRequestException(
                'This expense was not created by you!',
            );
        }

        await this.expenseModel.findByIdAndDelete(id);
    }
}
