import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  @Redirect('')
  getHello(@Req() req: Request) {
    if (req.cookies['Authentication'] === undefined) {
      return { url: 'upload' };
    } else {
      return { url: 'storage' };
    }
  }
}
