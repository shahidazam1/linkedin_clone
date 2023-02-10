import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EMPLOYEE_TYPE } from 'src/utils/constants';

@Schema({ timestamps: true, collection: 'experience' })
export class Experience extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ enum: EMPLOYEE_TYPE })
  type: string;

  @Prop({ required: true })
  companyName: string;

  @Prop()
  location: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop()
  industry: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  profileId: string;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
