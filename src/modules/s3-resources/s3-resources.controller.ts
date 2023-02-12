import { Controller, Get, Query } from '@nestjs/common';
import { S3ResourcesService } from './services/s3-resources.service';

@Controller('s3-resources')
export class S3ResourcesController {
  constructor(private readonly service: S3ResourcesService) {}

  @Get()
  getAllUploadedFiles(@Query() query: any) {
    return this.service.getAllUploadedFiles(query);
  }
}
