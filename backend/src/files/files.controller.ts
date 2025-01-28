import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Request,
    BadRequestException,
    Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { CreateFileDTO, GetFileDTO } from './files.schema';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Get()
    async getAll(@Request() request): Promise<GetFileDTO[]> {
        return await this.filesService.getAll(request.userId);
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

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.set('Content-Type', file.mime_type);
        res.send(file.data);
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @UploadedFile() file,
        @Body() body: { createFileDto: string },
        @Request() request,
    ) {
        try {
            const createFileDto: CreateFileDTO = JSON.parse(body.createFileDto);

            createFileDto.mime_type = file.mimetype;

            const result = await this.filesService.create_file_entry(
                createFileDto,
                request.userId,
                [file.buffer,
                file.size],
            );

            return result;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new BadRequestException('Invalid createFileDto format');
            }
            throw error;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() request): Promise<void> {
        return this.filesService.delete(id, request.userId);
    }
}
