import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 's3_resources' })
export class S3Resource extends Document {
  @Prop({ type: MongooseSchema.Types.String })
  originalFileName: string;

  @Prop({ required: true, unique: true, type: MongooseSchema.Types.String })
  key: string;

  @Prop()
  type: string;

  @Prop()
  subType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  typeId: string;

  @Prop()
  mediaType: string;

  @Prop()
  mimeType: string;

  @Prop({ type: MongooseSchema.Types.Number })
  fileSize: number;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  s3Response: any;
}

export const S3ResourceSchema = SchemaFactory.createForClass(S3Resource);

export const setUrl = (value: S3Resource) => {
  value['_doc'].url = `${process.env.AWS_S3_BUCKET_BASE_URL}/${value.key}`;
  return value;
};
