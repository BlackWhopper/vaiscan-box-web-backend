import { UploadService } from './upload.service';
import { Controller, Post } from '@nestjs/common';
import { Req, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', null, {
      dest: 'uploads',
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    const hashes = [];
    try {
      for (const file of files) {
        hashes.push(await this.uploadService.uploadFile(file));
      }
      return hashes;
    } catch (err) {
      throw err;
    }
  }
}
