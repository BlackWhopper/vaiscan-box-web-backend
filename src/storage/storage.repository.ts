import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Storage } from './storage.entity';
@Injectable()
export class StorageRepository extends Repository<Storage> {
  constructor(private dataSource: DataSource) {
    super(Storage, dataSource.createEntityManager());
  }

  async uploadFile(
    uId: number,
    fileName: string,
    file: Express.Multer.File,
    path: string,
    hash: string,
  ) {
    const savedFile = this.create({
      file_name: fileName,
      original_name: file.originalname,
      file_type: file.mimetype,
      size: file.size,
      path,
      hash,
      user_id: uId,
    });

    return await this.save(savedFile);
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

  updateStatus(storage: Storage, status: number) {
    storage.status = status;
    this.save(storage);
  }
}
