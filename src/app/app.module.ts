import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DomainModule } from 'src/modules/domain/domain.module';
import { ExperienceModule } from 'src/modules/experience/experience.module';
import { ProfileModule } from 'src/modules/profile/profile.module';
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
  ],
})
export class AppModule {}
