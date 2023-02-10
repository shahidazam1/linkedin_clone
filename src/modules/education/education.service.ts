import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Education } from '../domain/schemas/education.schema';
import { Profile } from '../domain/schemas/profile.schema';
import { CreateEducationDto } from './dto/create-education.dto';

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

  findAll() {
    return `This action returns all education`;
  }

  async findOneByProfile() {
    return 'no null';
  }

  update(id: number, updateEducationDto: CreateEducationDto) {
    return `This action updates a #${id} education`;
  }

  remove(id: number) {
    return `This action removes a #${id} education`;
  }
}
