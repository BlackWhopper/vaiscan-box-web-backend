import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { StorageModule } from './storage/storage.module';
import { mariadbORMConfig } from './configs/typeorm.config';
import { UploadModule } from './upload/upload.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(mariadbORMConfig),
    StorageModule,
    UploadModule,
    FileModule],
  controllers: [AppController],
})
export class AppModule {}
