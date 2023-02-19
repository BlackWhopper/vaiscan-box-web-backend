import { StorageService } from './storage.service';
import {
  Body,
  Controller,
  HttpCode,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as fs from 'fs';
import { CreateDirDto, StorageIdDto, MoveFileDto } from './dto/storage.dto';
import * as formidable from 'formidable';

@Controller('storage')
@UseGuards(AuthGuard())
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getFileList(@Req() req, @Query('path') path?: string) {
    const uId = req.user.user_id;
    return this.storageService.getFileList(uId, path);
  }

  @Post('create')
  async createDirectory(
    @Req() req,
    @Body(ValidationPipe) createDirDto: CreateDirDto,
  ) {
    const uId = req.user.user_id;
    const dirName = createDirDto.name;
    const path = createDirDto.path;

    try {
      return await this.storageService.createDirectory(uId, dirName, path);
    } catch (err) {
      throw err;
    }
  }

  @Post('upload')
  async uploadFileInStorage(@Req() req) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../../uploads`,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) throw err;
      const path: any = fields.path;
      const isCover: any = fields.cover === 'true';

      for (const file in files) {
        await this.storageService.uploadFileInStorage(
          uId,
          userName,
          files[file],
          path,
          isCover,
        );
      }
      return;
    });
  }

  @Post('download')
  @HttpCode(200)
  async downloadFileInStorage(
    @Req() req,
    @Res() res: Response,
    @Body(ValidationPipe) storageIdDto: StorageIdDto,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const storageId = storageIdDto.storage_id;

    try {
      const { originalName, path } = await this.storageService.download(
        uId,
        userName,
        storageId,
      );
      res.download(path, originalName, (err) => {
        if (err) throw err;
        fs.unlinkSync(path);
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('move')
  @HttpCode(204)
  async moveFileInStorage(
    @Req() req,
    @Body(ValidationPipe) moveFileDto: MoveFileDto,
  ) {
    const uId = req.user.user_id;
    const storageId = moveFileDto.storage_id;
    const path = moveFileDto.path;

    try {
      return await this.storageService.moveFileInStorage(uId, storageId, path);
    } catch (err) {
      throw err;
    }
  }

  @Post('delete')
  @HttpCode(204)
  async deleteFileInStorage(
    @Req() req,
    @Body(ValidationPipe) storageIdDto: StorageIdDto,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const storageId = storageIdDto.storage_id;

    try {
      return await this.storageService.deletFileInStorage(
        uId,
        userName,
        storageId,
      );
    } catch (err) {
      throw err;
    }
  }
}
