import {
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsUsernameDto {
  @IsString()
  username: string;
}

export class AuthCredentialsPasswordDto {
  @IsNumber()
  user_id: number;

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
