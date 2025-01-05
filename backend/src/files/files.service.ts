import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './files.schema';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
    constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

    async create(createFileDto: CreateFileDto, fileBuffer: Buffer, size: number): Promise<File> {
        const newFile = new this.fileModel({
            ...createFileDto,
            data: fileBuffer,
            size,
        });

        return newFile.save();
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
}
