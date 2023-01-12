import { StorageService } from './storage.service';
import { Controller, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('storage')
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getHello() {
    return 'hello';
  }
}
