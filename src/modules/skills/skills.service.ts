import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../domain/schemas/profile.schema';
import { Skills } from '../domain/schemas/skills.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Skills.name) private skillModel: Model<Skills>,
  ) {}

  async create(skillDto: CreateSkillDto, userId) {
    const profile = await this.profileModel.findOne({ userId: userId });

    if (!profile) {
      throw new BadRequestException('Profile Not Found');
    }

    let skill = new this.skillModel();
    skill.skill = skillDto.skill;
    skill.profileId = profile._id;

    await skill.save();

    return skill;
  }

  findAll() {
    return `This action returns all skills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
