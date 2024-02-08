import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthLocalSignInDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
