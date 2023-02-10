import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience } from '../domain/schemas/experience.schema';
import { Profile } from '../domain/schemas/profile.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Experience.name) private expModel: Model<Experience>,
  ) {}

  async create(exp: CreateExperienceDto, userId) {
    const profile = await this.profileModel.findOne({ userId: userId });

    if (!profile) {
      throw new BadRequestException('Profile Not Found');
    }

    let expDetails = new this.expModel();
    expDetails.title = exp.title;
    expDetails.type = exp.type;
    expDetails.companyName = exp.companyName;
    expDetails.location = exp.location;
    expDetails.startDate = exp.startDate;
    expDetails.endDate = exp.endDate;
    expDetails.industry = exp.industry;
    expDetails.profileId = profile._id;
    await expDetails.save();

    return expDetails;
  }

  async findAll(userId) {
    const profileDetails = await this.profileModel.findOne({ userId: userId });
    if (!profileDetails) {
      throw new BadRequestException('Profile Not Found');
    }
    const exp = await this.expModel.find({ profileId: profileDetails._id });

    const data = await this.profileModel.aggregate([
      {
        $lookup: {
          from: 'experience',
          localField: '_id',
          foreignField: 'profileId',
          as: 'exp',
        },
      },
    ]);

    return { data };
  }

  async findOne(id: string) {
    const expDetails = await this.expModel.findOne({ id });
    if (!expDetails) {
      throw new BadRequestException('Experience Not Found');
    }
    return await this.expModel.findOne({ _id: expDetails._id });
  }

  update(id: number, updateExperienceDto: CreateExperienceDto) {
    return `This action updates a #${id} experience`;
  }

  remove(id: number) {
    return `This action removes a #${id} experience`;
  }
}
