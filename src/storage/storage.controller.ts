import { StorageService } from './storage.service';
import {
  Body,
  Controller,
  Param,
  Query,
  Redirect,
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
import { query, Response } from 'express';
import * as fs from 'fs';
import { CreateDirDto, StorageIdDto, GetPathDto } from './dto/storage.dto';

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

    await this.storageService.createDirectory(uId, dirName, path);
  }

  @Post('upload')
  //@Redirect('/storage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileInStorage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) getPathDto: GetPathDto,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const path = getPathDto.path;

    await this.storageService.uploadFileInStorage(uId, userName, file, path);
    if (path !== '/') {
      return { url: `/storage/${this.storageService.encryptPath(path)}` };
    }
  }

  @Post('download')
  //@Redirect('/storage')
  async downloadFileInStorage(
    @Req() req,
    @Res() res: Response,
    @Body(ValidationPipe) storageIdDto: StorageIdDto,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const storageId = storageIdDto.storage_id;

    const { originalName, path } = await this.storageService.download(
      uId,
      userName,
      storageId,
    );

    res.download(path, originalName, (err) => {
      if (err) throw err;
      fs.unlinkSync(path);
    });
  }

  @Post('delete')
  //@Redirect('/storage')
  async deleteFileInStorage(
    @Req() req,
    @Body(ValidationPipe) storageIdDto: StorageIdDto,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const storageId = storageIdDto.storage_id;

    try {
      await this.storageService.deletFileInStorage(uId, userName, storageId);
    } catch (err) {
      throw err;
    }
  }
}
