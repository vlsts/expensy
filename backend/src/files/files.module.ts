import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File, FileSchema } from './files.schema';
import { CurrenciesModule } from '../currencies/currencies.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        CurrenciesModule,
        ExpensesModule,
        CategoriesModule,
    ],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule { }
