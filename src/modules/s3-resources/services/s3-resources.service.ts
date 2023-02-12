import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrganizationResource } from '../resources/organization.resource';
import { UserResource } from '../resources/user.resource';
import { S3Resource, setUrl } from '../schema/s3-resources.schema';

@Injectable()
export class S3ResourcesService {
  public readonly userResource: UserResource;
  public readonly organizationResource: OrganizationResource;

  constructor(
    @InjectModel(S3Resource.name)
    private readonly s3ResourceModel: Model<S3Resource>,
  ) {
    this.userResource = new UserResource(this.s3ResourceModel);
    this.organizationResource = new OrganizationResource(this.s3ResourceModel);
  }

  async getAllUploadedFiles(query: any) {
    const queryParams = {};
    const count = await this.s3ResourceModel.countDocuments(queryParams);
    const files = await this.s3ResourceModel
      .find(queryParams)
      .skip(query.skip || 0)
      .limit(query.limit || count)
      .sort({ createdAt: -1 })
      .exec();
    return {
      count,
      result: files.map((value) => setUrl(value)),
    };
  }
}
