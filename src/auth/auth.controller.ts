import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthCreateDto,
  AuthPasswordDto,
  AuthUsernameDto,
} from './dto/auth.dto';
import { Request, Response } from 'express';
import * as config from 'config';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCreateDto: AuthCreateDto) {
    try {
      return await this.authService.signUp(authCreateDto);
    } catch (err) {
      throw err;
    }
  }

  @Post('/signin')
  @HttpCode(200)
  async signInUsername(
    @Body(ValidationPipe) authUsernameDto: AuthUsernameDto,
    @Req() req: Request,
  ) {
    try {
      const { user_id, username } = await this.authService.signInUsername(
        authUsernameDto.username,
      );

      req.session.user_id = user_id;
      req.session.username = username;
      req.session.cookie.maxAge = config.get('session.maxAge');

      return;
    } catch (err) {
      throw err;
    }
  }

  @Post('/signin/password')
  @HttpCode(200)
  async signInPass(
    @Body(ValidationPipe) authPasswordDto: AuthPasswordDto,
    @Req() req: Request,
  ) {
    if (!req.session.user_id) throw new BadRequestException();
    const user_id = req.session.user_id;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    req.session.destroy(() => {});
    try {
      return await this.authService.signInPassword(
        user_id,
        authPasswordDto.password,
      );
    } catch (err) {
      throw err;
    }
  }

  @Post('signout')
  @HttpCode(200)
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
    });
    return;
  }
}
