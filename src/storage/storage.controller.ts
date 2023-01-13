import { StorageService } from './storage.service';
import { Controller, Req, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('storage')
@UseGuards(AuthGuard())
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getFileList(@Req() req) {
    return this.storageService.getFileList(req.user.id);
  }
}
