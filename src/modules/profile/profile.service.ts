import { Connections } from './../domain/schemas/connections.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../domain/schemas/profile.schema';
import { User } from '../domain/schemas/user.schema';
import { S3ResourcesService } from '../s3-resources/services/s3-resources.service';
import { ConnectDto, CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Connections.name) private connectionModel: Model<Connections>,
    private readonly s3ResourcesService: S3ResourcesService,
  ) {}

  async create(profile: CreateProfileDto, id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new BadRequestException('user Not exists');
    }

    const exist = await this.profileModel.findOne({ userId: user._id });

    if (exist) {
      throw new BadRequestException('profile already exist');
    }

    let profileDetails = new this.profileModel();
    profileDetails.firstName = profile.firstName;
    profileDetails.lastName = profile.lastName;
    profileDetails.headline = profile.headline;
    profileDetails.city = profile.city;
    profileDetails.about = profile.about;
    profileDetails.userId = id;
    await profileDetails.save();

    return profileDetails;
  }

  async addConnection(connectData: ConnectDto, userId: string) {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new BadRequestException('user Not exists');
    }

    const exist = await this.profileModel.findOne({ userId: user._id });

    if (!exist) {
      throw new BadRequestException('profile already exist');
    }

    const connectionExist = await this.profileModel.findOne({
      _id: connectData.connectionProfileId,
    });

    if (!connectionExist) {
      throw new BadRequestException('User already exist');
    }

    const alreadyConnection = await this.connectionModel.findOne(
      {
        profileId: exist._id,
      },
      { connectionProfileId: connectData.connectionProfileId },
    );
    return alreadyConnection;

    const connect = new this.connectionModel();
    connect.profileId = exist._id;
    connect.connectionProfileId = connectData.connectionProfileId;
    connect.status = connectData.status;

    await connect.save();
    return { message: 'Invitaion Sent' };
  }

  async findOne(id: string, userId: string) {
    const profile = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new BadRequestException('Not Found');
    }

    return await this.profileModel.findOne({ _id: id });
  }

  async getAll() {
    return await this.profileModel.find({});
  }

  async getMyProfile(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new BadRequestException('user Not exists');
    }

    const profile = await this.profileModel.aggregate([
      { $match: { userId: user._id } },
      {
        $lookup: {
          from: 'experience',
          localField: '_id',
          foreignField: 'profileId',
          as: 'experience',
        },
      },
      {
        $lookup: {
          from: 'education',
          localField: '_id',
          foreignField: 'profileId',
          as: 'education',
        },
      },
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: 'profileId',
          as: 'skills',
        },
      },
      {
        $lookup: {
          from: 'connections',
          localField: '_id',
          foreignField: 'profileId',
          as: 'connections',
        },
      },
    ]);

    return profile;
  }

  uploadOrganizationLogo(file: Express.Multer.File) {
    return this.s3ResourcesService.organizationResource.uploadImage({ file });
  }

  async update(id: string, updateProfile: UpdateProfileDto, userId: string) {
    const profile = await this.profileModel.findOne({ _id: id });

    if (!profile) {
      throw new BadRequestException('Profile Does Not Exist');
    }

    profile.firstName = updateProfile.firstName;
    profile.lastName = updateProfile.lastName;
    profile.headline = updateProfile.headline;
    profile.city = updateProfile.city;
    profile.about = updateProfile.about;
    profile.userId = userId;
    await profile.save();

    return profile;
  }

  async remove(id: string) {
    return this.profileModel.remove({ _id: id });
  }
}
