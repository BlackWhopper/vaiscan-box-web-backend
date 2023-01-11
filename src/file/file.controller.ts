import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('file')
export class FileController {

  @Get(':hash')
  getFileInfo(@Param('hash') hash: string) {
    return hash;

  }
}
