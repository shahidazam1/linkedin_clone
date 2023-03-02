import { REQUEST_STATUS } from './../../utils/constants';
import { keyBy } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { exists } from 'fs';
import mongoose, { Model } from 'mongoose';
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

    // const connectionExist = await this.profileModel.findOne({
    //   _id: connectData.connectionProfileId,
    // });

    // if (!connectionExist) {
    //   throw new BadRequestException('User already exist');

    // }

    if (connectData.status === 'Pending') {
      const connect = new this.connectionModel();
      connect.profileId = exist._id;
      connect.connectionProfileId = connectData.connectionProfileId;
      connect.status = connectData.status;

      await connect.save();
      return { message: 'Invitaion Sent' };
    }

    // const connect = await this.connectionModel.findById({
    //   profileId: connectData.profileId,
    // });

    // console.log(connect);

    if (connectData.status === 'Accepted') {
      // const connect = await this.connectionModel.findOne({
      //   profileId: new mongoose.Types.ObjectId(connectData.profileId),
      //   connectionProfileId: exist._id,
      // });
      // connect.profileId = connectData.profileId;
      // connect.connectionProfileId = exist._id;
      // connect.status = connectData.status;

      // await connect.save();
      return { message: 'Invitaion Accepted' };
    }

    // if (connectData.status === 'Rejected') {
    //   await this.connectionModel.deleteOne({
    //     where: {
    //       connectionProfileId: connectData.connectionProfileId,
    //       profileId: exist._id,
    //     },
    //   });

    //   return { message: 'Invitaion Reverted' };
    // }
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

    const people = await this.connectionModel.aggregate([
      {
        $match: {
          connectionProfileId: profile._id,
          status: 'Accepted',
          $or: [
            { connectionProfileId: profile._id },
            { profileId: profile._id },
          ],
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

    return people;
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
