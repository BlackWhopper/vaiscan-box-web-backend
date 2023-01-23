import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
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

  @UseGuards(AuthGuard())
  @Get('manage')
  async getUserManagePage(@Req() req) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    return await this.userService.getUsers();
  }

  @UseGuards(AuthGuard())
  @Redirect('/user/manage')
  @Post('modify')
  async modifyUser(
    @Req() req,
    @Body(ValidationPipe) userModifyDto: UserModifyDto,
  ) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    try {
      await this.userService.modifyUser(userModifyDto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard())
  @Redirect('/user/manage')
  @Post('delete')
  async deleteUser(@Req() req, @Res() res: Response, @Body() body) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    const uId = body.user_id;
    try {
      await this.userService.deleteUser(uId);
    } catch (err) {
      throw err;
    }
  }
}
