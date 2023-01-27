import { StorageService } from './storage.service';
import {
  Body,
  Controller,
  HttpCode,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { CreateDirDto, StorageIdDto, UploadFileDto } from './dto/storage.dto';

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
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileInStorage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) uploadFileDto: UploadFileDto,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const path = uploadFileDto.path;
    const isCover = uploadFileDto.cover;

    return await this.storageService.uploadFileInStorage(
      uId,
      userName,
      file,
      path,
      isCover,
    );
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
