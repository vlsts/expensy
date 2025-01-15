import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { getModelToken } from '@nestjs/mongoose';
import { File } from './files.schema';
import { ConfigService } from '@nestjs/config';
import { CurrenciesService } from '../currencies/currencies.service';
import { ExpensesService } from '../expenses/expenses.service';
import { CategoriesService } from '../categories/categories.service';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard';

describe('Files Module', () => {
    let controller: FilesController;
    let service: FilesService;
    let fileModel: Model<File>;

    const testFile = {
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test'),
        size: 1024,
    };

    const testFileModel = {
        create: jest.fn(),
        find: jest.fn().mockReturnThis(),
        findById: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilesController],
            providers: [
                FilesService,
                {
                    provide: getModelToken(File.name),
                    useValue: testFileModel,
                },
                {
                    provide: ConfigService,
                    useValue: { get: jest.fn() },
                },
                {
                    provide: CurrenciesService,
                    useValue: { getCurrencyID: jest.fn() },
                },
                {
                    provide: ExpensesService,
                    useValue: { create: jest.fn() },
                },
                {
                    provide: CategoriesService,
                    useValue: { getCategoryID: jest.fn() },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<FilesController>(FilesController);
        service = module.get<FilesService>(FilesService);
        fileModel = module.get<Model<File>>(getModelToken(File.name));
    });

    describe('FileController', () => {
        it('should upload file successfully', async () => {
            const dto = {
                filename: 'test.pdf',
                mime_type: 'application/pdf',
                doOCR: false,
            };

            jest.spyOn(service, 'create').mockResolvedValue({
                id: 'file123',
            } as any);

            const result = await controller.create(
                testFile,
                { createFileDto: JSON.stringify(dto) },
                { userId: 'user123' },
            );

            expect(result).toBeDefined();
            expect(service.create).toHaveBeenCalled();
        });

        it('should throw BadRequestException for invalid DTO', async () => {
            const mockRequest = { userId: 'user123' };

            await expect(
                controller.create(
                    testFile,
                    { createFileDto: 'invalid-json' },
                    mockRequest,
                ),
            ).rejects.toThrow(BadRequestException);
        });

        it('should return all files for user', async () => {
            const mockFiles = [{ id: 'file1', filename: 'test1.pdf' }];
            jest.spyOn(service, 'findAll').mockResolvedValue(mockFiles as any);

            const result = await controller.findAll({ userId: 'user123' });

            expect(result).toEqual(mockFiles);
            expect(service.findAll).toHaveBeenCalledWith('user123');
        });

        it('should return file by id', async () => {
            const mockFileData = {
                mime_type: 'application/pdf',
                data: Buffer.from('test'),
            };

            jest.spyOn(service, 'findFileById').mockResolvedValue(
                mockFileData as any,
            );

            const mockResponse = {
                set: jest.fn(),
                send: jest.fn(),
            };

            await controller.getFile('file123', mockResponse as any);

            expect(mockResponse.set).toHaveBeenCalledWith(
                'Content-Type',
                'application/pdf',
            );
            expect(mockResponse.send).toHaveBeenCalledWith(mockFileData.data);
        });

        it('should return 404 for non-existent file', async () => {
            jest.spyOn(service, 'findFileById').mockResolvedValue(null);

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await controller.getFile('nonexistent', mockResponse as any);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith('File not found');
        });
    });

    describe('FileService', () => {
        describe('detectCurrency', () => {
            test.each([
                ['₹10.99', '₹'], // Indian Rupee
                ['¥10.99', '¥'], // Japanese Yen
                ['£10.99', '£'], // British Pound
                ['€10.99', '€'], // Euro
                ['$10.99', '$'], // US Dollar
            ])('should detect %s currency symbol best case', async (input, expected) => {
                const result = await service.detectCurrency([input, 'item']);
                expect(result).toBe(expected);
            });

            test.each([
                ['AED 10.99', 'AED'],
                ['AUD 10.99', 'AUD'],
                ['BGN 10.99', 'BGN'],
                ['BRL 10.99', 'BRL'],
                ['CAD 10.99', 'CAD'],
                ['CHF 10.99', 'CHF'],
                ['CLP 10.99', 'CLP'],
                ['COP 10.99', 'COP'],
                ['CZK 10.99', 'CZK'],
                ['DKK 10.99', 'DKK'],
                ['EUR 10.99', 'EUR'],
                ['GBP 10.99', 'GBP'],
                ['HKD 10.99', 'HKD'],
                ['HUF 10.99', 'HUF'],
                ['ILS 10.99', 'ILS'],
                ['JPY 10.99', 'JPY'],
                ['MXN 10.99', 'MXN'],
                ['NOK 10.99', 'NOK'],
                ['NZD 10.99', 'NZD'],
                ['PLN 10.99', 'PLN'],
                ['RON 10.99', 'RON'],
                ['RSD 10.99', 'RSD'],
                ['USD 10.99', 'USD'],
            ])('should detect %s 3 letter acronym best case', async (input, expected) => {
                const result = await service.detectCurrency([input, 'item']);
                expect(result).toBe(expected);
            });

            test.each([
                ['10.99₹', '₹'], // Indian Rupee
                ['10.99¥', '¥'], // Japanese Yen
                ['10.99£', '£'], // British Pound
                ['10.99€', '€'], // Euro
                ['10.99$', '$'], // US Dollar
            ])('should detect %s currency symbol reverse case', async (input, expected) => {
                const result = await service.detectCurrency([input, 'item']);
                expect(result).toBe(expected);
            });

            test.each([
                ['10.99 AED', 'AED'],
                ['10.99 AUD', 'AUD'],
                ['10.99 BGN', 'BGN'],
                ['10.99 BRL', 'BRL'],
                ['10.99 CAD', 'CAD'],
                ['10.99 CHF', 'CHF'],
                ['10.99 CLP', 'CLP'],
                ['10.99 COP', 'COP'],
                ['10.99 CZK', 'CZK'],
                ['10.99 DKK', 'DKK'],
                ['10.99 EUR', 'EUR'],
                ['10.99 GBP', 'GBP'],
                ['10.99 HKD', 'HKD'],
                ['10.99 HUF', 'HUF'],
                ['10.99 ILS', 'ILS'],
                ['10.99 JPY', 'JPY'],
                ['10.99 MXN', 'MXN'],
                ['10.99 NOK', 'NOK'],
                ['10.99 NZD', 'NZD'],
                ['10.99 PLN', 'PLN'],
                ['10.99 RON', 'RON'],
                ['10.99 RSD', 'RSD'],
                ['10.99 USD', 'USD'],
            ])('should detect %s 3 letter acronym reverse case', async (input, expected) => {
                const result = await service.detectCurrency([input, 'item']);
                expect(result).toBe(expected);
            });

            test.each([
                ['asdnlas dasnkldlkasn d 10.99₹sasd', '₹'], // Indian Rupee
                ['asdnlas dasnkldlkasn d 10.99¥sasd', '¥'], // Japanese Yen
                ['asdnlas dasnkldlkasn d 10.99£sasd', '£'], // British Pound
                ['asdnlas dasnkldlkasn d 10.99€sdas', '€'], // Euro
                ['asdnlas dasnkldlkasn d 10.99$dasd', '$'], // US Dollar
            ])('should detect %s currency symbol full case', async (input, expected) => {
                const result = await service.detectCurrency([input, 'item']);
                expect(result).toBe(expected);
            });

            test.each([
                ['asdvcddfgfd dfg dfg fasdasd 10.99 AED sdfsdfsdf fsd sd', 'AED'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 AUD asdvcddfg asadff', 'AUD'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 BGN asdvcddfg asadff', 'BGN'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 BRL asdvcddfg asadff', 'BRL'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 CAD asdvcddfg asadff', 'CAD'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 CHF asdvcddfg asadff', 'CHF'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 CLP asdvcddfg asadff', 'CLP'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 COP asdvcddfg asadff', 'COP'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 CZK asdvcddfg asadff', 'CZK'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 DKK asdvcddfg asadff', 'DKK'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 EUR asdvcddfg asadff', 'EUR'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 GBP asdvcddfg asadff', 'GBP'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 HKD asdvcddfg asadff', 'HKD'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 HUF asdvcddfg asadff', 'HUF'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 ILS asdvcddfg asadff', 'ILS'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 JPY asdvcddfg asadff', 'JPY'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 MXN asdvcddfg asadff', 'MXN'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 NOK asdvcddfg asadff', 'NOK'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 NZD asdvcddfg asadff', 'NZD'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 PLN asdvcddfg asadff', 'PLN'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 RON asdvcddfg asadff', 'RON'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 RSD asdvcddfg asadff', 'RSD'],
                ['asdvcddfgfd dfg dfg fasdasd 10.99 USD asdvcddfg asadff', 'USD'],
            ])('should detect %s 3 letter acronym full case', async (input, expected) => {
                const result = await service.detectCurrency([input, 'item']);
                expect(result).toBe(expected);
            });

            it('should not retrieve any currency', async () => {
                const result = await service.detectCurrency(["Some random text no currency in it USDtho -__-"]);
                expect(result).toEqual("No currency found");
            });
        });

        describe('extractNumbers', () => {
            it('should extract numbers from string', async () => {
                const result = await service.extractNumbers('Item cost $10.99');
                expect(result).toEqual([10.99]);
            });

            it('should not extract any numbers from string', async () => {
                const result = await service.extractNumbers('This string contains no numbers, maybe.. three?');
                expect(result).toEqual([]);
            });

            it('should handle multiple numbers', async () => {
                const result = await service.extractNumbers(
                    'Price: $10.99, Qty: 2',
                );
                expect(result).toEqual([10.99, 2]);
            });

            it('should handle multiple float numbers with different formats', async () => {
                const result = await service.extractNumbers(
                    'Price: $10.99, Qty: 2,34 5.34,54',
                );
                expect(result).toEqual([10.99, 2.34, 5.34, 54]);
            });
        });

        describe('escapeRegExp', () => {
            it('should escape special characters', async () => {
                const input = '.*+?^${}()|[]\\';
                const expected = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
                const result = await service.escapeRegExp(input);
                expect(result).toBe(expected);
            });
    
            it('should return the same string if no special characters', async () => {
                const input = 'hello';
                const expected = 'hello';
                const result = await service.escapeRegExp(input);
                expect(result).toBe(expected);
            });
    
            it('should escape a dollar sign', async () => {
                const input = '$';
                const expected = '\\$';
                const result = await service.escapeRegExp(input);
                expect(result).toBe(expected);
            });
    
            it('should escape multiple special characters', async () => {
                const input = 'abc$def*ghi?jkl';
                const expected = 'abc\\$def\\*ghi\\?jkl';
                const result = await service.escapeRegExp(input);
                expect(result).toBe(expected);
            });
        });

        describe('extractWordsUntilSymbol', () => {
            it('should extract words until the dollar sign', async () => {
                const input = "I have $100 in my account.";
                const symbol = "$";
                const expected = "I have";
                const result = await service.extractWordsUntilSymbol(input, symbol);
                expect(result).toBe(expected);
            });
    
            it('should extract words until the euro sign', async () => {
                const input = "The price is €50.";
                const symbol = "€";
                const expected = "The price is";
                const result = await service.extractWordsUntilSymbol(input, symbol);
                expect(result).toBe(expected);
            });
    
            it('should return empty string if symbol is not found', async () => {
                const input = "No special characters here.";
                const symbol = "$";
                const expected = "";
                const result = await service.extractWordsUntilSymbol(input, symbol);
                expect(result).toBe(expected);
            });
    
            it('should handle multiple spaces correctly', async () => {
                const input = "This   is a test   string   with  $ symbols.";
                const symbol = "$";
                const expected = "This is a test string with";
                const result = await service.extractWordsUntilSymbol(input, symbol);
                expect(result).toBe(expected);
            });
    
            it('should escape special characters in the symbol', async () => {
                const input = "This is a test string with . and * symbols.";
                const symbol = ".";
                const expected = "This is a test string with";
                const result = await service.extractWordsUntilSymbol(input, symbol);
                expect(result).toBe(expected);
            });
        });
    });
});
