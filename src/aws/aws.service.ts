import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
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

  uploadS3(file: Express.Multer.File, fileName: string, userName: string) {
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
    try {
      this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: userName + '/',
        }),
      );
    } catch (err) {
      throw err;
    }
  }

  async downloadS3(userName: string, fileName: string) {
    try {
      const data = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: userName + '/' + fileName,
        }),
      );
      return data;
    } catch (err) {
      throw err;
    }
  }
}
