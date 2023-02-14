import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { exists } from 'fs';
import { Model } from 'mongoose';
import { Connections } from '../domain/schemas/connections.schema';
import { Profile } from '../domain/schemas/profile.schema';
import { User } from '../domain/schemas/user.schema';
import { CreateConnectionDto } from './dto/connections.dto';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Connections.name) private connectionModel: Model<Connections>,
  ) {}

  async addConnection(connectData: CreateConnectionDto, userId: string) {
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

    const connect = new this.connectionModel();
    connect.profileId = exist._id;
    connect.connectionProfileId = connectData.connectionProfileId;
    connect.status = connectData.status;

    await connect.save();
    return { message: 'Invitaion Sent' };
  }

  async findAll() {
    return await this.connectionModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} connection`;
  }

  async update(
    id: string,
    updateConnectionDto: CreateConnectionDto,
    userId: any,
  ) {
    const connection = await this.connectionModel.findOne({ _id: id });

    const profile = await this.profileModel.findOne({ userId });

    if (!connection || !profile) {
      throw new BadRequestException('Something Went Wrong');
    }

    connection.profileId = updateConnectionDto.profileId;
    connection.connectionProfileId = profile._id;
    connection.status = updateConnectionDto.status;
    await connection.save();
    return connection;
  }

  remove(id: number) {
    return `This action removes a #${id} connection`;
  }
}
