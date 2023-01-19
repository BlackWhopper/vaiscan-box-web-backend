import {
  Body,
  Controller,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthCreateDto } from './dto/auth.dto';
import express, { Request, Response, NextFunction } from 'express';
import * as config from 'config';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Redirect('')
  async signUp(@Body(ValidationPipe) authCreateDto: AuthCreateDto) {
    try {
      await this.authService.signUp(authCreateDto);
    } catch (err) {
      return err;
    }
    return { url: 'user/login' };
  }

  @Post('signin')
  @Redirect('')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signIn(authCredentialsDto);
    res.cookie('Authentication', token.accessToken, {
      httpOnly: true,
      maxAge: config.get('jwt.expiresIn'),
    });
    return { url: '/storage' };
  }
}
