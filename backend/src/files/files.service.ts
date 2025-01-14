import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './files.schema';
import { CreateFileDto } from './dto/create-file.dto';
import { OcrService } from 'src/ocr/ocr.service';
import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto';

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        private ocrService: OcrService,
    ) {}

    async create(
        createFileDto: CreateFileDto,
        fileBuffer: Buffer,
        size: number,
    ) {
        const newFile = new this.fileModel({
            ...createFileDto,
            data: fileBuffer,
            size,
        });

        newFile.save()

        if (createFileDto.doOCR) {
            const addedExpenses: CreateExpenseDto[] = await this.ocrService.doOCR(fileBuffer, newFile.filename);

            return addedExpenses;
        }
    }

    async findAll(): Promise<File[]> {
        return this.fileModel.find().exec();
    }

    async findFileById(id: string): Promise<File | null> {
        return this.fileModel.findById(id).exec();
    }

    async findFileByFilename(filename: string): Promise<File | null> {
        return this.fileModel.findOne({ filename }).exec();
    }

    async getFileID(filename: string): Promise<string> {
        return (await this.fileModel.findOne({filename}).exec())._id.toString();
    }
}
