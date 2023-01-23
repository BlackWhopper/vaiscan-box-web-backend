import {
  Body,
  Controller,
  Post,
  Redirect,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreateDto } from './dto/auth.dto';
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

  @Post('/signin/username')
  async signInUsername(
    @Body(ValidationPipe) body,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user_id, username } = await this.authService.signInUsername(
        body.username,
      );

      req.session.user_id = user_id;
      req.session.username = username;
      req.session.cookie.maxAge = config.get('session.maxAge');

      res.redirect('/signin/password');
    } catch (err) {
      throw err;
    }
  }

  @Post('/signin/password')
  async signInPass(
    @Body(ValidationPipe) body,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.session.user_id) return res.redirect('/signin');
    const user_id = req.session.user_id;
    try {
      const token = await this.authService.signInPassword(
        user_id,
        body.password,
      );
      res.cookie('token', token.accessToken, {
        httpOnly: true,
        maxAge: config.get('jwt.expiresIn'),
      });

      req.session.destroy((err) => {
        if (err) console.log(err);
      });
      res.redirect('/storage');
    } catch (err) {
      throw err;
    }
  }

  @Post('signout')
  @Redirect('/upload')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
    });
  }
}
