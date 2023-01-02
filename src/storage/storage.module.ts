import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [StorageController],
    providers: [StorageService],
})
export class StorageModule {}