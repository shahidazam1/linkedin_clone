import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsNotEmpty()
  @IsString()
  school: string;

  @IsNotEmpty()
  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  field: string;

  @IsOptional()
  @IsString()
  grade: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}
