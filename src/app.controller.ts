import { Controller, Get, Query, Redirect } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  @Redirect('')
  getHello() {
    if(1===1) {
      return { url: 'storage'}
    }
  }
}
