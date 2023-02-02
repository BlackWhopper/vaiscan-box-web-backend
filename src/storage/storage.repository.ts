import { Injectable, Put } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Storage } from './storage.entity';
@Injectable()
export class StorageRepository extends Repository<Storage> {
  constructor(private dataSource: DataSource) {
    super(Storage, dataSource.createEntityManager());
  }

  uploadFile(
    uId: number,
    fileName: string,
    file: Object,
    path: string,
    hash: string,
  ) {
    const savedFile = this.create({
      file_name: fileName,
      original_name: file['originalFilename'],
      file_type: file['mimetype'],
      size: file['size'],
      path,
      hash,
      user_id: uId,
    });

    this.save(savedFile);
  }

  async createDirectory(uId: number, dirName: string, path: string) {
    const createDir = this.create({
      original_name: dirName,
      file_type: 'dir',
      path,
      user_id: uId,
    });
    await this.save(createDir);
  }

  async updatePath(storage: Storage, path: string) {
    storage.path = path;
    await this.save(storage);
  }
}
