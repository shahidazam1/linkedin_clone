import { BadRequestException, Sse } from '@nestjs/common';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { checkEqual } from '../../../utils/utils';
import { S3Resource, setUrl } from '../schema/s3-resources.schema';
import { S3ResourceManager } from '../services/s3-resource.manager';

export interface OrganizationResourceProps {
  file: Express.Multer.File;
  typeId?: string;
}

export const type = 'organization';
export const subType = 'logo';

export class OrganizationResource extends S3ResourceManager {
  private model: Model<S3Resource>;

  constructor(s3ResourceModel: Model<S3Resource>) {
    super(s3ResourceModel);
    this.model = s3ResourceModel;
  }

  async uploadImage(props: OrganizationResourceProps) {
    if (!props.file) {
      throw new BadRequestException('File is required');
    }
    const fileExtension = props.file.originalname.split('.').pop();
    if (this.getMediaType(props.file.mimetype) !== 'image') {
      throw new BadRequestException('Uploaded File is not an image');
    }

    return this.uploadToS3({
      file: props.file,
      type: type,
      subType: subType,
      typeId: props.typeId,
      key: `${type}/${subType}/${v4()}.${fileExtension}`,
    });
  }

  async updateTypeId(typeId: string, key: string) {
    const s3Resource = await this.model
      .findOne({
        key: key,
        type,
        subType,
      })
      .then(function (s3Resource) {
        setUrl(s3Resource);
        return s3Resource;
      });

    if (!s3Resource) {
      throw new BadRequestException('S3 resource not found');
    }

    if (checkEqual(s3Resource.typeId, typeId)) {
      return s3Resource;
    }

    const existing = await this.model.findOne({
      type: type,
      subType: subType,
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

  async findOne(typeId: string) {
    const s3Resource = await this.model.findOne({
      type,
      subType,
      typeId,
    });

    return s3Resource;
  }
}
