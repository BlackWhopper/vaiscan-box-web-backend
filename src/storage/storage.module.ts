import { StorageRepository } from './storage.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth/auth.module';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Module } from '@nestjs/common';
import { Storage } from './storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Storage]), AuthModule],
  exports: [StorageService],
  controllers: [StorageController],
  providers: [StorageService, StorageRepository],
})
export class StorageModule {}
