import {
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class AuthCreateDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsString()
  alias: string;
}

export class UserModifyDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsString()
  alias: string;
}
