import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File, FileSchema } from './files.schema';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        CurrenciesModule,
        ExpensesModule,
        CategoriesModule
    ],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}
