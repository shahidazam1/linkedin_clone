import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { REQUEST_STATUS } from 'src/utils/constants';

@Schema({ timestamps: true, collection: 'connections', id: true })
export class Connections extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  profileId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  connectionProfileId: string;

  @Prop({ enum: REQUEST_STATUS })
  status: string;
}

export const ConnectionsSchema = SchemaFactory.createForClass(Connections);
