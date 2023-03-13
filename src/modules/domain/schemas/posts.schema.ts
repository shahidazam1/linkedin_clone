import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'posts', id: true })
export class Posts extends Document {
  @Prop({ required: true })
  text: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
