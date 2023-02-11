import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Education } from '../domain/schemas/education.schema';
import { Profile } from '../domain/schemas/profile.schema';
import {
  CreateEducationDto,
  UpdateEducationDto,
} from './dto/create-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Education.name) private eduModel: Model<Education>,
  ) {}

  async create(eduData: CreateEducationDto, userId) {
    const profile = await this.profileModel.findOne({ userId: userId });

    if (!profile) {
      throw new BadRequestException('Profile Not Found');
    }

    let eduDetails = new this.eduModel();
    eduDetails.school = eduData.school;
    eduDetails.degree = eduData.degree;
    eduDetails.field = eduData.field;
    eduDetails.grade = eduData.grade;
    eduDetails.startDate = eduData.startDate;
    eduDetails.endDate = eduData.endDate;
    eduDetails.profileId = profile._id;
    await eduDetails.save();

    return eduDetails;
  }

  async findOne(id: string) {
    const expDetails = await this.eduModel.findOne({ _id: id });

    if (!expDetails) {
      throw new BadRequestException('Experience Not Found');
    }
    return await this.eduModel.findOne({ _id: expDetails._id });
  }

  async update(id: string, eduData: UpdateEducationDto) {
    const eduDetails = await this.eduModel.findOne({ _id: id });

    if (!eduDetails) {
      throw new BadRequestException('Profile Not Found');
    }

    eduDetails.school = eduData.school;
    eduDetails.degree = eduData.degree;
    eduDetails.field = eduData.field;
    eduDetails.grade = eduData.grade;
    eduDetails.startDate = eduData.startDate;
    eduDetails.endDate = eduData.endDate;
    await eduDetails.save();

    return eduDetails;
  }

  async remove(id: string) {
    await this.eduModel.remove({ _id: id });
    return { message: 'success' };
  }
}
