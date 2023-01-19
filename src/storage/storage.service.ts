import { AwsService } from './../aws/aws.service';
import { UploadService } from './../upload/upload.service';
import { StorageRepository } from './storage.repository';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  constructor(
    private storageRepository: StorageRepository,
    private uploadService: UploadService,
    private awsService: AwsService,
  ) {}

  async getRootFileList(uId: number) {
    return await this.storageRepository.findBy({ user_id: uId, path: '/' });
  }

  async getSubFileList(uId: number, encodedPath: string) {
    const path = Buffer.from(encodedPath).toString('utf8');
    return await this.storageRepository.findBy({ user_id: uId, path });
  }

  async uploadFileInStorage(
    uId: number,
    userName: string,
    file: Express.Multer.File,
    path: string,
  ) {
    const random = Math.floor(Math.random() * (999999 - 100001) + 100000);
    const fileName = `${Date.now()}-${random}`;
    const hash = await this.uploadService.uploadFile(file);

    this.storageRepository.uploadFile(uId, fileName, file, path, hash);
    this.awsService.uploadFile(file, fileName, userName);
    // fs.writeFile(`files/${userName}/${fileName}`, file.buffer, (err) => {
    //   if (err) throw err;
    // });
  }
}
