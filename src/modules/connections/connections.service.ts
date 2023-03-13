import { REQUEST_STATUS } from './../../utils/constants';
import { keyBy } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { exists } from 'fs';
import mongoose, { Model, mongo } from 'mongoose';
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
    const profile = await this.profileModel.findOne({ userId: user._id });
    if (!profile) {
      throw new BadRequestException('profile already exist');
    }

    //Connctions

    if (connectData.status === 'Pending') {
      const connect = new this.connectionModel();
      connect.profileId = profile._id;
      connect.connectionProfileId = connectData.connectionProfileId;
      connect.status = connectData.status;
      await connect.save();
      return { message: 'Invitaion Sent' };
    }

    if (connectData.status === 'Accepted') {
      const connect = await this.connectionModel.findOne({
        profileId: connectData.profileId,
        connectionProfileId: profile.id,
      });

      connect.status = connectData.status;
      connect.profileId = connectData.profileId;
      connect.connectionProfileId = profile._id;
      await connect.save();
      return { message: 'Invitaion Accepted' };
    }

    if (connectData.status === 'Rejected') {
      const data = await this.connectionModel.findOneAndDelete({
        connectionProfileId: connectData.connectionProfileId,
        profileId: profile.id,
      });

      if (data) {
        return { message: 'Invitaion Reverted' };
      } else {
        throw new BadRequestException('Error Occured');
      }
    }
  }

  async findAll(userId: string) {
    const id = new mongoose.Types.ObjectId(userId);
    const profile = await this.profileModel.findOne({ userId: id });

    const people = await this.profileModel.aggregate([
      { $match: { userId: { $ne: id } } },
    ]);

    const connections = await this.connectionModel.aggregate([
      {
        $match: {
          profileId: profile._id,
          status: { $eq: 'Pending' },
        },
      },
    ]);

    const connectionMap = keyBy(connections, 'connectionProfileId');

    const data = people.map((i) => {
      return {
        ...i,
        connection: connectionMap[i._id],
      };
    });

    return data;
  }

  async getAllInvitations(userId) {
    const profile = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new BadRequestException('Pofile Not Found');
    }

    const people = await this.connectionModel.aggregate([
      { $match: { connectionProfileId: profile._id, status: 'Pending' } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'profileId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return people;
  }

  async getMyConnections(userId) {
    const profile = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new BadRequestException('Pofile Not Found');
    }

    const connnectionMyRequest = await this.connectionModel.aggregate([
      {
        $match: {
          status: 'Accepted',
          profileId: profile._id,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'connectionProfileId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const connnectionTheyRequest = await this.connectionModel.aggregate([
      {
        $match: {
          status: 'Accepted',
          connectionProfileId: profile._id,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'profileId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return [...connnectionMyRequest, ...connnectionTheyRequest];
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
