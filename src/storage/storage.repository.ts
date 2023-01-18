import { Injectable, Put } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Storage } from './storage.entity';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';
import * as config from 'config';

const aws = config.get('aws');

@Injectable()
export class StorageRepository extends Repository<Storage> {
  constructor(private dataSource: DataSource) {
    super(Storage, dataSource.createEntityManager());
  }

  uploadFile(
    uId: number,
    fileName: string,
    file: Express.Multer.File,
    path: string,
    hash: string,
  ) {
    const savedFile = this.create({
      file_name: fileName,
      original_name: file.originalname,
      file_type: file.mimetype,
      size: file.size,
      path,
      hash,
      user_id: uId,
    });

    this.save(savedFile);
  }
}

@Injectable()
export class AwsRepository {
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
}
