import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthUsernameDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}

export class AuthPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

export class AuthCreateDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  alias: string;
}

export class UserModifyDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  alias: string;
}

export class UserDeleteDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
