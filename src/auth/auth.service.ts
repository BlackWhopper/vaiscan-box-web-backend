import { AwsService } from './../aws/aws.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './auth.repository';
import * as bcrypt from 'bcryptjs';
import { AuthCreateDto } from './dto/auth.dto';
import * as config from 'config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private awsService: AwsService,
  ) {}

  async signUp(authCreateDto: AuthCreateDto): Promise<void> {
    try {
      await this.userRepository.createUser(authCreateDto);
      this.awsService.createDirectory(authCreateDto.username);
    } catch (err) {
      throw err;
    }
  }

  async signInUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException('login failed');
    }
    return { user_id: user.user_id, username: user.username };
  }

  async signInPassword(
    user_id: number,
    password: string,
  ): Promise<{ accessToken: string; expiresIn: number; alias: string }> {
    const user = await this.userRepository.findOneBy({ user_id });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 (Secret + Payload)
      this.userRepository.updateLoginTime(user);
      const payload = { username: user.username };
      return {
        accessToken: await this.jwtService.sign(payload),
        expiresIn: config.get('jwt.expiresIn'),
        alias: user.alias,
      };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
