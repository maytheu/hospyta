import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Category } from './category.schema';
import { Post } from './post.schema';

export type PostDocument = HydratedDocument<Reaction>;

@Schema()
export class Reaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop({ default: 0 })
  like: number;

  @Prop()
  reaction: boolean;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
