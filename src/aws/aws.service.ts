import { Injectable } from '@nestjs/common';
import {
  S3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
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

  uploadS3(fileName: string, userName: string, data: Buffer) {
    const uploadParam = {
      Bucket: this.bucket,
      Key: userName + '/' + fileName,
      Body: data,
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

  async deleteUserDir(userName: string) {
    try {
      const listedObjects = await this.s3.send(
        new ListObjectsCommand({
          Bucket: this.bucket,
          Prefix: userName + '/',
        }),
      );

      if (listedObjects.Contents.length === 0) return;

      const deleteParams = {
        Bucket: this.bucket,
        Delete: { Objects: [] },
      };

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      await this.s3.send(new DeleteObjectsCommand(deleteParams));

      if (listedObjects.IsTruncated) await this.deleteUserDir(userName);
    } catch (err) {
      throw err;
    }
  }

  async deleteFile(userName: string, fileName: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: userName + '/' + fileName,
        }),
      );
    } catch (err) {
      throw err;
    }
  }
}
