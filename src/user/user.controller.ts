import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserModifyDto } from 'src/auth/dto/auth.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('login')
  getLoginPage() {
    return 'login page';
  }

  @UseGuards(AuthGuard())
  @Get('manage')
  async getUserManagePage(@Req() req) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    return await this.userService.getUsers();
  }

  @UseGuards(AuthGuard())
  @Post('modify')
  async modifyUser(
    @Req() req,
    @Res() res: Response,
    @Body(ValidationPipe) userModifyDto: UserModifyDto,
  ) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    try {
      await this.userService.modifyUser(userModifyDto);
    } catch (error) {
      throw error;
    }
    res.redirect('/user/manage');
  }
}
