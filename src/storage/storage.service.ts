import { FileTypePathDto } from './dto/upload-file.dto';
import { StorageRepository } from './storage.repository';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  constructor(private storageRepository: StorageRepository) {}

  async getRootFileList(uId: number) {
    return await this.storageRepository.findBy({ user_id: uId, path: '/' });
  }

  async getSubFileList(uId: number, encodedPath: string) {
    const path = Buffer.from(encodedPath).toString('utf8');
    return await this.storageRepository.findBy({ user_id: uId, path });
  }

  uploadFileInStorage(
    uId: number,
    file: Express.Multer.File,
    fileTypePathDto: FileTypePathDto,
  ) {
    const random = Math.random() * 1000000;
    const fileName = '' + Date.now() + random;

    fs.writeFile(`./files/${uId}/${fileName}`, file.buffer, (err) => {
      if (err) throw err;
    });
  }
}
