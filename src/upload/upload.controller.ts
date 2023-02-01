import { UploadService } from './upload.service';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as formidable from 'formidable';
import { Req } from '@nestjs/common/decorators';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.uploadFile(file);
  }

  @Post('test')
  async uploadTest(@Req() req) {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      console.log('\n-----------');
      console.log('Fields', fields);
      console.log('Received:', files);
      console.log();
    });
  }
}
