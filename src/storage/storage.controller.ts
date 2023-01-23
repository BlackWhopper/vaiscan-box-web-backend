import { StorageService } from './storage.service';
import {
  Body,
  Controller,
  Param,
  Redirect,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('storage')
@UseGuards(AuthGuard())
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getRootFileList(@Req() req) {
    return this.storageService.getRootFileList(req.user.user_id);
  }

  @Get(':path')
  getSubFileList(@Req() req, @Param('path') path: string) {
    return this.storageService.getSubFileList(req.user.user_id, path);
  }

  @Post('upload')
  //@Redirect('/storage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileInStorage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const path = body.path;

    await this.storageService.uploadFileInStorage(uId, userName, file, path);
    if (path !== '/') {
      return { url: `/storage/${this.storageService.encryptPath(path)}` };
    }
  }

  @Post('download')
  //@Redirect('/storage')
  async downloadFileInStorage(@Req() req, @Res() res: Response, @Body() body) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const storageId = body.storageId;

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
  async deleteFileInStorage(@Req() req, @Body() body) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const storageId = body.storage_id;

    try {
      await this.storageService.deletFileInStorage(uId, userName, storageId);
    } catch (err) {
      throw err;
    }
  }
}
