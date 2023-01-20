import { UserRepository } from './../auth/auth.repository';
import { Injectable } from '@nestjs/common';
import { UserModifyDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUsers() {
    return await this.userRepository.find();
  }

  async modifyUser(userModifyDto: UserModifyDto) {
    await this.userRepository.modifyUser(userModifyDto);
  }
}
