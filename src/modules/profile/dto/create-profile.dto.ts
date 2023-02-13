import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { REQUEST_STATUS } from 'src/utils/constants';

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

export class ConnectDto {
  @IsNotEmpty()
  @IsString()
  connectionProfileId: string;

  @IsNotEmpty()
  // @IsEnum(REQUEST_STATUS)
  status: string;
}
