import { UploadRepository } from './upload.repository';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import * as config from 'config';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor(private uploadRepository: UploadRepository) {}

  getHash(data: Buffer) {
    const hash = createHash('sha256');

    hash.update(data);
    const hashSum = hash.digest('hex');

    return hashSum;
  }

  staticFileTransfer(file: Object, data: Buffer) {
    const fileName = file['origianlFilename'];
    const fileSize = file['size'];

    console.log(data.length, fileSize);
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
        ws.send(fileName);
      } else if (msg.data === 'FILESIZE') {
        ws.send(fileSize);
      } else if (msg.data === 'DATA') {
        ws.send(data.slice(pos, pos + bufferSize));
        pos = pos + bufferSize;
        if (pos > fileSize) {
          pos = fileSize;
        }
      }
    };
    ws.onclose = () => {
      console.log('disconnected');
    };
  }

  async uploadFile(file: Object): Promise<string> {
    const filePath = file['filepath'];
    const data = fs.readFileSync(filePath);
    const hash = this.getHash(data);

    const fileInfo = await this.uploadRepository.findOneBy({ hash });
    await fs.unlinkSync(filePath);
    if (!fileInfo) {
      this.uploadRepository.insertFile(hash);
      //this.staticFileTransfer(file, data); //파일 전송
      return hash;
    } else {
      this.uploadRepository.updateCheckTime(fileInfo);
      return fileInfo.hash;
    }
  }
}
