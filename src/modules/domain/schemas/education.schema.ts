import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'education' })
export class Education extends Document {
  @Prop({ required: true, unique: true })
  school: string;

  @Prop({ required: true })
  degree: string;

  @Prop()
  field: string;

  @Prop()
  grade: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  profileId: string;
}

export const EducationSchema = SchemaFactory.createForClass(Education);
