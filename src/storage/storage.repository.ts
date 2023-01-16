import { Injectable } from '@nestjs/common';
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

    this.save(savedFile);
  }
}
