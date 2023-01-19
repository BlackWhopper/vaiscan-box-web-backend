import { AwsModule } from './../aws/aws.module';
import { AuthModule } from './../auth/auth.module';
import { UploadModule } from './../upload/upload.module';
import { StorageRepository } from './storage.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Module } from '@nestjs/common';
import { Storage } from './storage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Storage]),
    UploadModule,
    AuthModule,
    AwsModule,
  ],
  exports: [StorageService],
  controllers: [StorageController],
  providers: [StorageService, StorageRepository],
})
export class StorageModule {}
