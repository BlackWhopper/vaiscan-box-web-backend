import { aIServer } from './../configs/socket.config';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { io } from 'socket.io-client';

@Injectable()
export class UploadService {
    getHash(file: Express.Multer.File): string{
        const shaSum = createHash('sha256');
        const buffer = file.buffer;
    
        shaSum.update(buffer);
        const hashed = shaSum.digest('hex');

        return hashed;
    }

    staticFileTransfer(file: Express.Multer.File) {
        const socket = io(aIServer.staticServer);
        socket.emit('test');
    }
    
}
