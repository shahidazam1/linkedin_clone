import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsOptional()
  @IsString()
  connectionProfileId: string;

  @IsOptional()
  @IsString()
  profileId: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
