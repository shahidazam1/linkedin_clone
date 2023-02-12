import { BadRequestException, Sse } from '@nestjs/common';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { S3Resource, setUrl } from '../schema/s3-resources.schema';
import { S3ResourceManager } from '../services/s3-resource.manager';

export interface UserResourceProps {
  file: Express.Multer.File;
  typeId?: string;
}

export class UserResource extends S3ResourceManager {
  private model: Model<S3Resource>;

  constructor(s3ResourceModel: Model<S3Resource>) {
    super(s3ResourceModel);
    this.model = s3ResourceModel;
  }

  async uploadProfileImage(props: UserResourceProps) {
    if (!props.file) {
      throw new BadRequestException('File is required');
    }
    const fileExtension = props.file.originalname.split('.').pop();
    if (this.getMediaType(props.file.mimetype) !== 'image') {
      throw new BadRequestException('Uploaded File is not an image');
    }

    return this.uploadToS3({
      file: props.file,
      type: 'users',
      subType: 'profile-images',
      typeId: props.typeId,
      key: `users/profile-images/${v4()}.${fileExtension}`,
    });
  }

  async updateProfileImageTypeId(typeId: string, key: string) {
    const s3Resource = await this.model.findOne({
      key: key,
    });
    if (!s3Resource) {
      throw new BadRequestException('S3 resource not found');
    }

    if (s3Resource.typeId == typeId) {
      return setUrl(s3Resource);
    }

    const existing = await this.model.findOne({
      type: 'users',
      subType: 'profile-images',
      typeId,
    });
    if (existing) {
      existing.typeId = null;
      await existing.save();
    }

    s3Resource.typeId = typeId;
    await s3Resource.save();
    return setUrl(s3Resource);
  }

  async findProfileImage(typeId: string) {
    const s3Resource = await this.model.findOne({
      type: 'users',
      subType: 'profile-images',
      typeId,
    });

    return s3Resource;
  }

  async findProfileImages(typeIds: string[]) {
    if (typeIds.length === 0) return [];
    const s3Resources = await this.model.find({
      type: 'users',
      subType: 'profile-images',
      typeId: { $in: typeIds },
    });
    return s3Resources.map((s3Resource) => setUrl(s3Resource));
  }
}
