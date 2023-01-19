import { UserService } from './user.service';
import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
    if (req.user.id !== 1) throw new UnauthorizedException();
    return await this.userService.getUsers();
  }
}
