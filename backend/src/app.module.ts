import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpensesModule } from './expenses/expenses.module';

import config from './config/config';
import { CurrenciesModule } from './currencies/currencies.module';
import { FilesModule } from './files/files.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('db_url'),
                auth: {
                    username: configService.get<string>('db_username'),
                    password: configService.get<string>('db_password'),
                },
                dbName: configService.get<string>('db_name'),
            }),
        }),
        CategoriesModule,
        ExpensesModule,
        CurrenciesModule,
        FilesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
