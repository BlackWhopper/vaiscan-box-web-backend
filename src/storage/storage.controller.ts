import { FileTypePathDto } from './dto/upload-file.dto';
import { StorageService } from './storage.service';
import {
  Body,
  Controller,
  Param,
  Redirect,
  Req,
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
  @Redirect('/storage')
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
  @Redirect('/storage')
  downloadFileInStorage(@Req() req, @Body() body) {
    const uId = req.user.user_id;
    const userName = req.user.body;
    const storageId = body.storage_id;
  }

  @Post('delete')
  @Redirect('/storage')
  async deleteFileInStorage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    const uId = req.user.user_id;
    const userName = req.user.username;
    const storageId = body.storage_id;

    try {
      await this.storageService.deletFileInStorage(uId, storageId, userName);
    } catch (err) {
      throw err;
    }
  }
}
