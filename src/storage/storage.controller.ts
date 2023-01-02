import { StorageService } from './storage.service';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getHello() {
    return 'hello';
  }
}
