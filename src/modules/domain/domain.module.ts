import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Experience, ExperienceSchema } from './schemas/experience.schema';
import { Education, EducationSchema } from './schemas/education.schema';
import { Skills, SkillsSchema } from './schemas/skills.schema';
import { Connections, ConnectionsSchema } from './schemas/connections.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: Skills.name, schema: SkillsSchema }]),
    MongooseModule.forFeature([
      { name: Connections.name, schema: ConnectionsSchema },
    ]),
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
