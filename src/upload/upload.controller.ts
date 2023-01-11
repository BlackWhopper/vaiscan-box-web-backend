import { UploadService } from './upload.service';
import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, Get, Redirect, HttpStatus, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  
  @Get()
  getUploadPage() {
    return 'upload page';
  }

  @Post()
  @Redirect('')
  @UseInterceptors(FileInterceptor('fieldName'))
  async uploadFile(@UploadedFile() file: Express.Multer.File,) {
    const hash = await this.uploadService.uploadFile(file);
   return { "url": `file/${hash}`, "statusCode": HttpStatus.MOVED_PERMANENTLY}; //왜 POST로 요청이 가는거야!!!
  }
}
