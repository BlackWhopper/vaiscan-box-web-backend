import { AwsService } from './../aws/aws.service';
import { UploadService } from './../upload/upload.service';
import { StorageRepository } from './storage.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Storage } from './storage.entity';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  constructor(
    private storageRepository: StorageRepository,
    private uploadService: UploadService,
    private awsService: AwsService,
  ) {}

  encryptPath(plainPath: string) {
    return Buffer.from(plainPath, 'utf8').toString('base64');
  }
  decryptPath(encryptPath: string) {
    return Buffer.from(encryptPath, 'base64').toString('utf8');
  }

  async getFileList(uId: number, encodedPath?: string): Promise<Storage[]> {
    const path = encodedPath ? this.decryptPath(encodedPath) : '/';
    return await this.storageRepository.findBy({ user_id: uId, path });
  }

  async createDirectory(
    uId: number,
    dirName: string,
    path: string,
  ): Promise<void> {
    const find = await this.storageRepository.findOneBy({
      user_id: uId,
      path,
      original_name: dirName,
      file_type: 'dir',
    });
    if (find) throw new ConflictException('Existing directory name');
    await this.storageRepository.createDirectory(uId, dirName, path);
  }

  async uploadFileInStorage(
    uId: number,
    userName: string,
    file: Object,
    path: string,
    isCover: boolean,
  ): Promise<void> {
    const originalName = file['originalFilename'];
    const filePath = file['filepath'];
    const data = fs.readFileSync(filePath);

    const find = await this.storageRepository.findOneBy({
      user_id: uId,
      path,
      original_name: originalName,
    });

    if (find && find.file_type != 'dir') {
      if (isCover) {
        await this.deletFileInStorage(uId, userName, find.storage_id);
      } else {
        return;
      }
    }
    const random = Math.floor(Math.random() * (999999 - 100001) + 100000);
    const fileName = `${Date.now()}-${random}`;
    const hash = await this.uploadService.uploadFile(file);
    await this.storageRepository.uploadFile(uId, fileName, file, path, hash);
    this.awsService.uploadS3(fileName, userName, data);
  }

  async download(user_id: number, userName: string, storage_id: number) {
    const find = await this.storageRepository.findOneBy({
      user_id,
      storage_id,
    });

    if (!find || find.file_type === 'dir') throw new BadRequestException();

    const data = await this.awsService.downloadS3(userName, find.file_name);
    const path = `temp/${find.file_name}`;
    fs.writeFileSync(path, await data.Body.transformToByteArray());

    return { originalName: find.original_name, path };
  }

  async moveFileInStorage(
    user_id: number,
    storage_id: number,
    path: string,
  ): Promise<void> {
    const find = await this.storageRepository.findOneBy({
      user_id,
      storage_id,
    });
    if (!find) throw new BadRequestException();

    return await this.storageRepository.updatePath(find, path);
  }

  async deletFileInStorage(
    user_id: number,
    userName: string,
    storage_id: number,
  ) {
    const find = await this.storageRepository.findOneBy({
      user_id,
      storage_id,
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
        this.deletFileInStorage(user_id, userName, storage_id);
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
