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
    return this.storageService.getRootFileList(req.user.id);
  }

  @Get(':path')
  getSubFileList(@Req() req, @Param('path') path: string) {
    return this.storageService.getSubFileList(req.user.id, path);
  }
  @Post()
  //@Redirect('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileInStorage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() data,
  ) {
    console.log(data.path);
    this.storageService.uploadFileInStorage(req.user.id, file, data.path);
  }
}
