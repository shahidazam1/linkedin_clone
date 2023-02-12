import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3ResourcesController } from './s3-resources.controller';
import { S3Resource, S3ResourceSchema } from './schema/s3-resources.schema';
import { S3ResourcesService } from './services/s3-resources.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: S3Resource.name, schema: S3ResourceSchema },
    ]),
  ],
  controllers: [S3ResourcesController],
  providers: [S3ResourcesService],
  exports: [S3ResourcesService],
})
export class S3ResourcesModule {}
