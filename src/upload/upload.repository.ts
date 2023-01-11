import { DataSource } from 'typeorm';
import { CheckFile } from './check_file.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadRepository extends Repository<CheckFile> {
  constructor(private dataSource: DataSource) {
    super(CheckFile, dataSource.createEntityManager());
  }

  async getDataByHash(hash: string): Promise<CheckFile> {
    const found = await this.findOneBy({hash});
    return found;
  }

  insertFile(hash: string): void{
    const file = this.create({ hash });
    this.save(file);
  }
}