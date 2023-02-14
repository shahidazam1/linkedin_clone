import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConnectionsModule } from 'src/modules/connections/connections.module';
import { DomainModule } from 'src/modules/domain/domain.module';
import { EducationModule } from 'src/modules/education/education.module';
import { ExperienceModule } from 'src/modules/experience/experience.module';
import { ProfileModule } from 'src/modules/profile/profile.module';
import { S3ResourcesModule } from 'src/modules/s3-resources/s3-resources.module';
import { SkillsModule } from 'src/modules/skills/skills.module';
import mongoConfig from '../config/mongodb-connection';

ConfigModule.forRoot({ isGlobal: true });

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig().MONGO_URI),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './upload',
    }),
    DomainModule,
    AuthModule,
    ProfileModule,
    ExperienceModule,
    EducationModule,
    SkillsModule,
    S3ResourcesModule,
    ConnectionsModule,
  ],
})
export class AppModule {}
