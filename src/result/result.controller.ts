import { ResultService } from './result.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('result')
export class ResultController {
  constructor(private resultService: ResultService) {}

  @Get(':hash')
  async getResult(@Param('hash') hash: string) {
    return await this.resultService.getResult(hash);
  }
}
