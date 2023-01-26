import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StorageIdDto {
  @IsNumber()
  @IsNotEmpty()
  storage_id: number;
}

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  path: string;
  @IsBoolean()
  @IsNotEmpty()
  cover: boolean;
}

export class CreateDirDto {
  @IsString()
  @IsNotEmpty()
  path: string;
  name: string;
}
