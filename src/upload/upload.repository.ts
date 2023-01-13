import { DataSource } from 'typeorm';
import { CheckFile } from './check_file.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadRepository extends Repository<CheckFile> {
  constructor(private dataSource: DataSource) {
    super(CheckFile, dataSource.createEntityManager());
  }

  insertFile(hash: string): void {
    const file = this.create({ hash });
    this.save(file);
  }

  updateCheckTime(fileInfo: CheckFile) {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    fileInfo.last_check_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.save(fileInfo);
  }
}
