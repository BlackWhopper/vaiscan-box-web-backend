import { StorageService } from './storage.service';
import { Controller, Param, Req, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';

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
}
