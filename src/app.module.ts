import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from './storage/storage.module';
import * as config from 'config';
import { UploadModule } from './upload/upload.module';
import { ResultModule } from './result/result.module';
import { AwsModule } from './aws/aws.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

const mariaDB = config.get('mariadb');
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: mariaDB.type,
      host: process.env.MARIA_HOSTNAME || mariaDB.host,
      port: process.env.MARIA_PORT || mariaDB.port,
      username: process.env.MARIA_USERNAME || mariaDB.username,
      password: process.env.MARIA_PASSWORD || mariaDB.password,
      database: process.env.MARIA_DATABASE || mariaDB.database,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: mariaDB.synchronize,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_HOSTNAME || config.get('mongodb.host'),
    ),
    StorageModule,
    UploadModule,
    ResultModule,
    AuthModule,
    AwsModule,
    UserModule,
  ],
})
export class AppModule {}
