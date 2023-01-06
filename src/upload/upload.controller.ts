import { UploadService } from './upload.service';
import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('fieldName'))
  uploadFile(@UploadedFile() file: Express.Multer.File, ) {
    console.log(file);
    this.uploadService.staticFileTransfer(file);
  }
}
