import { UploadService } from './upload.service';
import { Controller, Post } from '@nestjs/common';
import * as formidable from 'formidable';
import { Req } from '@nestjs/common/decorators';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async uploadFile(@Req() req) {
    const hashes = [];
    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../../uploads`,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) throw err;
      for (const file in files) {
        hashes.push(await this.uploadService.uploadFile(files[file]));
      }
      return hashes;
    });
  }
}
