import { UploadRepository } from './upload.repository';
import { aIServer } from './../configs/socket.config';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { io } from 'socket.io-client';
import { CheckFile } from './check_file.entity';

@Injectable()
export class UploadService {
  constructor(private uploadRepository: UploadRepository) {}

  getHash(file: Express.Multer.File) {
    const hash = createHash('sha256');
    const buffer = file.buffer;

    hash.update(buffer);
    const hashSum = hash.digest('hex');

    return hashSum;
  }

  // staticFileTransfer(file: Express.Multer.File) {
  //     const socket = io(aIServer.staticServer);
  //     socket.emit('test');
  // }

  async uploadFile(file: Express.Multer.File) {
    const hashSum = this.getHash(file);
    const fileInfo = await this.uploadRepository.getDataByHash(hashSum);
    if (!fileInfo) {
      this.uploadRepository.insertFile(hashSum);
      // 파일 전송
    } else {
      return fileInfo.hash;
    }
  }
}
