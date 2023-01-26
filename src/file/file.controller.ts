import { Controller, Get, Param } from '@nestjs/common';

@Controller('file')
export class FileController {
  @Get(':hash')
  getFileInfo(@Param('hash') hash: string) {
    return hash;
  }
}
