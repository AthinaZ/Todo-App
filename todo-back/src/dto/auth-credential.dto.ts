import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;
}
