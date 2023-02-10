import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'skills' })
export class Skills extends Document {
  @Prop({ required: true, unique: true })
  skill: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  profileId: string;
}

export const SkillsSchema = SchemaFactory.createForClass(Skills);
