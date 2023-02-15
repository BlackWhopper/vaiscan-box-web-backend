import { ResultService } from './../result/result.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckFile } from './check_file.entity';
import { UploadController } from './upload.controller';
import { UploadRepository } from './upload.repository';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([CheckFile]), ResultService],
  exports: [UploadService],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}
