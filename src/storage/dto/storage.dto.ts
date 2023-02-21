import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StorageIdDto {
  @IsNumber()
  @IsNotEmpty()
  storage_id: number;
}

export class MoveFileDto extends StorageIdDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}

// export class UploadFileDto {
//   @IsString()
//   @IsNotEmpty()
//   path: string;
//   @IsBoolean()
//   @IsNotEmpty()
//   cover: boolean;
// }

export class CreateDirDto {
  @IsString()
  @IsNotEmpty()
  path: string;
  name: string;
}
