import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Expense } from './expenses.schema';
import { Service } from '../base/service';

@Injectable()
export class ExpensesService extends Service<Expense> {
    constructor(
        @InjectModel(Expense.name)
        private expenseModel: Model<HydratedDocument<Expense>>,
    ) {
        super(expenseModel);
    }
}
