import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from './auth.entity';
import { UserRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });
const jwtConfig = config.get('jwt');
@Module({
  imports: [
    passportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [AuthService, JwtStrategy, UserRepository, passportModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
})
export class AuthModule {}
