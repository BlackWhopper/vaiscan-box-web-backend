import { UploadRepository } from './upload.repository';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CheckFile } from './check_file.entity';
import { WebSocket } from 'ws';
import * as config from 'config';

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

  staticFileTransfer(file: Express.Multer.File) {
    console.log(file.buffer.length, file.size);
    const ws = new WebSocket(config.get('ai.static'));
    const bufferSize = 1e7;
    let pos = 0;
    console.log('input');
    ws.onopen = (event) => {
      ws.send('START');
      console.log('start');
    };
    ws.onmessage = (msg) => {
      console.log(msg.data);
      ws.send(msg.data);

      if (msg.data === 'FILENAME') {
        ws.send(file.originalname);
      } else if (msg.data === 'FILESIZE') {
        ws.send(file.size);
      } else if (msg.data === 'DATA') {
        ws.send(file.buffer.slice(pos, pos + bufferSize));
        pos = pos + bufferSize;
        if (pos > file.size) {
          pos = file.size;
        }
      }
    };
    ws.onclose = () => {
      console.log('disconnected');
    };
  }

  async uploadFile(file: Express.Multer.File) {
    const hash = this.getHash(file);
    const fileInfo = await this.uploadRepository.findOneBy({ hash });
    if (!fileInfo) {
      this.uploadRepository.insertFile(hash);
      this.staticFileTransfer(file);
      return `/file/${fileInfo.hash}`;
    } else {
      this.uploadRepository.updateCheckTime(fileInfo);
      return `/file/${fileInfo.hash}`;
    }
  }
}
