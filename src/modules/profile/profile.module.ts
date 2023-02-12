import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { S3ResourcesModule } from '../s3-resources/s3-resources.module';

@Module({
  imports: [S3ResourcesModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
