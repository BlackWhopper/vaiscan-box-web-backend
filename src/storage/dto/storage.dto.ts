import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StorageIdDto {
  @IsNumber()
  @IsNotEmpty()
  storage_id: number;
}

export class GetPathDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}

export class CreateDirDto extends GetPathDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
