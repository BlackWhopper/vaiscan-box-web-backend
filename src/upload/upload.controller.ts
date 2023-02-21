import { UploadService } from './upload.service';
import { Controller, Post } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'temp',
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      return await this.uploadService.uploadFile(file);
    } catch (err) {
      throw err;
    }
  }
}
