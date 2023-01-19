import { AwsService } from './../aws/aws.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './auth.repository';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialsDto, AuthCreateDto } from './dto/auth.dto';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private awsService: AwsService,
  ) {}

  async signUp(authCreateDto: AuthCreateDto) {
    try {
      await this.userRepository.createUser(authCreateDto);
      this.awsService.createDirectory(authCreateDto.username);
      fs.mkdir('files/' + authCreateDto.username, (err) => {
        if (err) throw err;
      });
    } catch (err) {
      throw err;
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 (Secret + Payload)
      this.userRepository.updateLoginTime(user);
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
