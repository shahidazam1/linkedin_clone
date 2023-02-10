import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  headline: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  about: string;
}
