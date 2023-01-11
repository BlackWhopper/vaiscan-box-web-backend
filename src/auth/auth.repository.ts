import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./auth.entity";
import { ConflictException, InternalServerErrorException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {username, password} = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({username, password: hashedPassword});

    try {
      await this.save(user);
    } catch(error) {
      if(error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

 
}