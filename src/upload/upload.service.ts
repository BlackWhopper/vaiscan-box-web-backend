import { ResultService } from './../result/result.service';
import { UploadRepository } from './upload.repository';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import * as config from 'config';
import * as fs from 'fs';
@Injectable()
export class UploadService {
  constructor(
    private uploadRepository: UploadRepository,
    private resultService: ResultService,
  ) {}

  getHash(data: Buffer) {
    const hash = createHash('sha256');

    hash.update(data);
    const hashSum = hash.digest('hex');

    return hashSum;
  }

  fileTransfer(hash: string, fileSize: number, data: Buffer) {
    const ws = new WebSocket(config.get('ai.host'));
    const bufferSize = 10485760;
    let pos = 0;
    try {
      ws.onopen = () => {
        ws.send('START');
        console.log('start');
      };
      ws.onmessage = (msg) => {
        console.log(msg.data);
        ws.send(msg.data);

        if (msg.data === 'HASH') {
          ws.send(hash);
        } else if (msg.data === 'FILESIZE') {
          ws.send(fileSize);
        } else if (msg.data === 'DATA') {
          ws.send(data.slice(pos, pos + bufferSize));
          pos = pos + bufferSize;
          if (pos > fileSize) {
            pos = fileSize;
          }
        }
        ws.onclose = () => {
          console.log('disconnected');
        };
      };
    } catch (err) {
      throw err;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filePath = file.path;
    const fileSize = file.size;
    const data = fs.readFileSync(filePath);
    const hash = this.getHash(data);

    const fileInfo = await this.uploadRepository.findOneBy({ hash });
    try {
      await fs.unlinkSync(filePath);
      if (!fileInfo) {
        this.uploadRepository.insertFile(hash);
        this.resultService.createDocument(hash);
        this.fileTransfer(hash, fileSize, data); //파일 전송
        return hash;
      } else {
        this.uploadRepository.updateCheckTime(fileInfo);
        return fileInfo.hash;
      }
    } catch (err) {
      throw err;
    }
  }
}
