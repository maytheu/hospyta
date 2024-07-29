import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Reaction, ReactionSchema } from 'src/schemas/reaction.schemma';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
})
export class PostModule {}
