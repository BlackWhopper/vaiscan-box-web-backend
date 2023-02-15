import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from './result.schema';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
  ) {}

  async getResult(hash: string): Promise<Result> {
    const find = await this.resultModel.findOne({ hash }).exec();
    if (!find) {
      throw new BadRequestException();
    }
    return find;
  }

  createDocument(hash: string) {
    const create = new this.resultModel({ hash, progress: 0, risk: null });
    create.save();
  }
}
