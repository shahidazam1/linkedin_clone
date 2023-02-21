import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
