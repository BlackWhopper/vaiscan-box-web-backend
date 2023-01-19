import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import * as config from 'config';

const aws = config.get('aws');
@Injectable()
export class AwsService {
  private region = process.env.AWS_REGION || aws.region;
  private s3 = new S3({
    region: this.region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY || aws.acessKey,
      secretAccessKey: process.env.AWS_SECRET_KEY || aws.secretAccessKey,
    },
  });
  private bucket = aws.bucket;
  uploadFile(file: Express.Multer.File, fileName: string, userName: string) {
    const uploadParam = {
      Bucket: this.bucket,
      Key: userName + '/' + fileName,
      Body: file.buffer,
    };
    try {
      this.s3.send(new PutObjectCommand(uploadParam));
    } catch (err) {
      console.log('Error', err);
    }
  }

  createDirectory(userName: string) {
    const directoryParam = {
      Bucket: this.bucket,
      Key: userName + '/',
    };
    try {
      this.s3.send(new PutObjectCommand(directoryParam));
    } catch (err) {
      throw err;
    }
  }
}
