import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { FileList } from './storage/entity/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: '3.35.205.173',
      port: 3306,
      username: 'blackwhopper',
      password: 'qjrjzld@',
      database: 'vaiscan',
      entities: [FileList],
      synchronize: true,
    }),
    StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
