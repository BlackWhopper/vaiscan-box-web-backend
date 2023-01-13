import { AuthCredentialsDto, AuthCreateDto } from './dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './auth.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCreateDto: AuthCreateDto): Promise<void> {
    const { username, password, name } = authCreateDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword, name });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username'); //사용자 존재
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  updateLoginTime(user: User) {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    user.last_login = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.save(user);
  }
}
