import { UnprocessableEntityException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import { UploadToS3Props } from '../dto/s3-resource.dto';
import { S3Resource, setUrl } from '../schema/s3-resources.schema';

export class S3ResourceManager {
  constructor(private readonly s3ResourceModel: Model<S3Resource>) {}

  private getS3() {
    return new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  getMediaType(mimeType: string) {
    return mimeType.split('/')[0];
  }

  async uploadToS3(props: UploadToS3Props) {
    const s3Response = await this.getS3()
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: props.key,
        Body: props.file.buffer,
        ContentType: props.file.mimetype,
      })
      .promise()
      .catch((err) => {
        throw new UnprocessableEntityException(err.message);
      });
    const s3Resource = new this.s3ResourceModel();
    s3Resource.originalFileName = props.file.originalname;
    s3Resource.key = props.key;
    s3Resource.mediaType = this.getMediaType(props.file.mimetype);
    s3Resource.mimeType = props.file.mimetype;
    s3Resource.fileSize = props.file.size;
    s3Resource.s3Response = s3Response;
    s3Resource.type = props.type;
    s3Resource.subType = props.subType;
    s3Resource.typeId = props.typeId;
    return s3Resource.save().then(setUrl);
  }

  async deleteFile(id: string) {
    const s3Resource = await this.s3ResourceModel.findById(id);
    if (!s3Resource) return;
    s3Resource.typeId = null;
    await s3Resource.save();
  }

  private async deleteFileIfExists(props: UploadToS3Props) {
    const query = {
      typeId: props.typeId,
    };
    if (props.type) {
      query['type'] = props.type;
    }
    if (props.subType) {
      query['subType'] = props.subType;
    }
    const s3Resource = await this.s3ResourceModel.findOne(query);
    if (!s3Resource) return;
    s3Resource.typeId = null;
    await s3Resource.save();
  }
}
