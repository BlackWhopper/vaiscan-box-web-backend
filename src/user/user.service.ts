import { StorageRepository } from './../storage/storage.repository';
import { AwsService } from './../aws/aws.service';
import { UserRepository } from './../auth/auth.repository';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UserModifyDto } from 'src/auth/dto/auth.dto';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private storageRepository: StorageRepository,
    private awsService: AwsService,
  ) {}

  async getUsers() {
    return await this.userRepository.find();
  }

  async modifyUser(userModifyDto: UserModifyDto) {
    try {
      await this.userRepository.modifyUser(userModifyDto);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(uId: number) {
    if (uId === 1)
      throw new NotAcceptableException("Can't delete Admin account");

    const user = await this.userRepository.findOneBy({ user_id: uId });
    if (!user) throw new NotFoundException(`Can't find User with id ${uId}`);

    try {
      await this.awsService.deleteUserDir(user.username);
      fs.rmSync(`files/${user.username}`, { recursive: true, force: true });
      await this.storageRepository.delete({ user_id: uId });
      await this.userRepository.delete({ user_id: uId });
    } catch (err) {
      throw err;
    }
  }
}
