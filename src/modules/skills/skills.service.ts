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

  async findAll() {
    return await this.skillModel.find({});
  }

  async findOne(id: string) {
    return await this.skillModel.findOne({ _id: id });
  }

  async update(id: string, skillDto: CreateSkillDto) {
    const skillData = await this.skillModel.findOne({ _id: id });

    if (!skillData) {
      throw new BadRequestException('Skill Not Found');
    }

    skillData.skill = skillDto.skill;

    await skillData.save();

    return skillData;
  }

  async remove(id: string) {
    return await this.skillModel.remove({ _id: id });
  }
}
