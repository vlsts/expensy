import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { File } from './files.schema';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get()
    async findAll(): Promise<File[]> {
        return this.filesService.findAll();
    }

    @Get(':id')
    async getFile(@Param('id') id: string, @Res() res: Response) {
        const file = await this.filesService.findFileById(id);

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.set('Content-Type', file.mime_type);
        res.send(file.data);
    }

    @Get('/filename/:filename')
    async getFileByFilename(
        @Param('filename') filename: string,
        @Res() res: Response,
    ) {
        const file = await this.filesService.findFileByFilename(filename);

        console.log(file);

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.set('Content-Type', file.mime_type);
        res.send(file.data);
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() createFileDto: CreateFileDto,
        @UploadedFile() file,
    ){
        createFileDto.mime_type = file.mimetype;
        this.filesService.create(createFileDto, file.buffer, file.size);
    }
}
