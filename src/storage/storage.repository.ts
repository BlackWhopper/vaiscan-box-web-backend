import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Storage } from './storage.entity';

@Injectable()
export class StorageRepository extends Repository<Storage> {
  constructor(private dataSource: DataSource) {
    super(Storage, dataSource.createEntityManager());
  }
}
