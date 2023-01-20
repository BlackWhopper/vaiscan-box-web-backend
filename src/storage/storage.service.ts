import { AwsService } from './../aws/aws.service';
import { UploadService } from './../upload/upload.service';
import { StorageRepository } from './storage.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  constructor(
    private storageRepository: StorageRepository,
    private uploadService: UploadService,
    private awsService: AwsService,
  ) {}

  encryptPath(plainPath: string) {
    return Buffer.from(plainPath).toString('base64');
  }
  decryptPath(encryptPath: string) {
    return Buffer.from(encryptPath).toString('utf8');
  }

  async getRootFileList(uId: number) {
    return await this.storageRepository.findBy({ user_id: uId, path: '/' });
  }

  async getSubFileList(uId: number, encodedPath: string) {
    const path = this.decryptPath(encodedPath);
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

    await this.storageRepository.uploadFile(uId, fileName, file, path, hash);
    this.awsService.uploadS3(file, fileName, userName);
    // fs.writeFile(`files/${userName}/${fileName}`, file.buffer, (err) => {
    //   if (err) throw err;
    // });
  }

  async deletFileInStorage(
    user_id: number,
    storage_id: number,
    userName: string,
  ) {
    const find = await this.storageRepository.findOneBy({
      storage_id,
      user_id,
    });
    if (!find) throw new BadRequestException();

    if (find.file_type === 'dir') {
      let path;
      if (find.path === '/') {
        path = '/' + find.original_name;
      } else {
        path = find.path + '/' + find.original_name;
      }
      const fileInDir = await this.storageRepository.findBy({
        path: path,
        user_id,
      });
      await fileInDir.forEach(({ storage_id }) => {
        this.deletFileInStorage(user_id, storage_id, userName);
      });
    }

    try {
      if (find.file_type !== 'dir') {
        await this.awsService.deleteFile(userName, find.file_name);
        //fs.rmSync(`files/${userName}/${find.file_name}`);
      }
      await this.storageRepository.delete({ storage_id, user_id });
    } catch (err) {
      throw err;
    }
  }
}
