import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDeleteDto, UserModifyDto } from 'src/auth/dto/auth.dto';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @Get('manage')
  async getUserManagePage(@Req() req) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    return await this.userService.getUsers();
  }

  @Post('modify')
  @HttpCode(204)
  async modifyUser(
    @Req() req,
    @Body(ValidationPipe) userModifyDto: UserModifyDto,
  ) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    try {
      return await this.userService.modifyUser(userModifyDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('delete')
  @HttpCode(204)
  async deleteUser(@Req() req, @Body() userDeleteDto: UserDeleteDto) {
    if (req.user.user_id !== 1) throw new UnauthorizedException('Not Admin');
    const uId = userDeleteDto.user_id;
    try {
      return await this.userService.deleteUser(uId);
    } catch (err) {
      throw err;
    }
  }
}
