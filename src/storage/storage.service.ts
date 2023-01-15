import { StorageRepository } from './storage.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  constructor(private storageRepository: StorageRepository) {}
  async getRootFileList(uId: number) {
    return await this.storageRepository.findBy({ user_id: uId, path: '/' });
  }
  getSubFileList(uId: number, path: string) {}
}
