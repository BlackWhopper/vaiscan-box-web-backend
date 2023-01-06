import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { mariadbORMConfig } from './configs/typeorm.config';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(mariadbORMConfig),
    StorageModule,
    UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
