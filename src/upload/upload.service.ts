import { aIServer } from './../configs/socket.config';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import WebSocket, { WebSocketServer } from 'ws';

@Injectable()
export class UploadService {
    async getHash(file: Express.Multer.File): Promise<string>{
        const shasum = createHash('sha256');
        const buffer = file.buffer;
    
        shasum.update(buffer);
        const hashed = await shasum.digest('hex');

        return hashed;
    }

    staticFileTransfer(file: Express.Multer.File) {
        const ws = new WebSocket(aIServer.staticServer);
        ws.on('open', function open() {
            ws.send('START');
        });
        ws.on('message', function message() {
            ws.send(file.filename);
        });
    }
    
}
