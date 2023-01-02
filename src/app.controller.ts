import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('')
  getHello() {
    if(1===1) {
      return { url: 'storage'}
    }
  }
}
