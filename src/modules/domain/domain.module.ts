import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Experience, ExperienceSchema } from './schemas/experience.schema';
import { Education, EducationSchema } from './schemas/education.schema';
import { Skills, SkillsSchema } from './schemas/skills.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: Skills.name, schema: SkillsSchema }]),
    MongooseModule.forFeature([
      { name: Education.name, schema: EducationSchema },
    ]),
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DomainModule {}
