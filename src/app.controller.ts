import { Controller, Get, Query, Redirect, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get()
  @Redirect('')
  getHello(@Req() req: Request) {
    if (req.cookies['token'] === undefined) {
      return { url: 'upload' };
    } else {
      return { url: 'storage' };
    }
  }

  @Get('/signin')
  getLoginPage() {
    return 'id page';
  }

  @Get('/signin/password')
  getPasswordInputPage(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user_id) return res.redirect('/signin');
    res.send('password page');
  }
}
