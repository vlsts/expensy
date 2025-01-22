import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseDTO, Expense, ExpenseDocument } from './expenses.schema';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    ) {}

    async create(
        createExpenseDto: Omit<ExpenseDTO, 'id_expense' | 'id_user'>,
        userId: string,
    ): Promise<Expense> {
        const newExpense = new this.expenseModel({
            ...createExpenseDto,
            id_user: userId,
        });

        const intermediateExpense = await newExpense.save();

        return {
            name: intermediateExpense.name,
            amount: intermediateExpense.amount,
            id_currency: intermediateExpense.id_currency,
            description: intermediateExpense.description,
            id_files: intermediateExpense.id_files,
            id_category: intermediateExpense.id_category,
            date: intermediateExpense.date,
            id_user: intermediateExpense.id_user,
        }
    }

    async getAll(userId: string): Promise<Omit<ExpenseDTO, 'id_user'>[]> {
        let expenses: ExpenseDocument[] = await this.expenseModel.find({
            id_user: userId,
        });

        let expensesDTO: Omit<ExpenseDTO, 'id_user'>[];

        expensesDTO = expenses.map((expense) => {
            return {
                id_expense: expense._id.toString(),
                name: expense.name,
                amount: expense.amount,
                id_currency: expense.id_currency,
                description: expense.description,
                id_files: expense.id_files,
                id_category: expense.id_category,
                date: expense.date,
            };
        });

        return expensesDTO;
    }

    async update(
        id: string,
        updateExpenseDto: Partial<ExpenseDTO>
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
