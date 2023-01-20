import {
  Body,
  Controller,
  Post,
  Redirect,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthCreateDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import * as config from 'config';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) authCreateDto: AuthCreateDto,
  ) {
    try {
      await this.authService.signUp(authCreateDto);
    } catch (err) {
      throw err;
    }
    res.redirect('/user/login');
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.signIn(authCredentialsDto);
      res.cookie('token', token.accessToken, {
        httpOnly: true,
        maxAge: config.get('jwt.expiresIn'),
      });
    } catch (err) {
      throw err;
    }
    res.redirect('/storage');
  }

  @Post('signout')
  @Redirect('/upload')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
    });
  }
}
