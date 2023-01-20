import { StorageModule } from './../storage/storage.module';
import { AwsModule } from './../aws/aws.module';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule, AwsModule, StorageModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
