import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Comment } from 'src/schemas/comment.schema';
import { Post } from 'src/schemas/post.schema';
import { Reaction } from 'src/schemas/reaction.schemma';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private cloudinary: CloudinaryService,
  ) {}

  async newPost(userId: string, data: any, file: Express.Multer.File) {
    const postImage = await this.cloudinary.uploadImage(file);

    const post = { ...data, userId, Image: postImage.url };
    await this.postModel.create(post);

    return { message: 'new post created', post };
  }

  async allPost(filter: any) {
    const query = { isDeleted: false };

    return await this.postModel.find(query);
  }

  async post(postId: string) {
    if (!mongoose.isValidObjectId(postId))
      return new NotFoundException('Post not found');

    return await this.postModel
      .findById(postId)
      .populate({ path: 'userId', select: 'imaage username' })
      .populate({ path: 'category', select: 'name' });
  }

  async updatePost(postId: string, data: any, file?: Express.Multer.File) {
    if (!mongoose.isValidObjectId(postId))
      return new NotFoundException('Post not found');

    if (file) data.image = (await this.cloudinary.uploadImage(file)).url;
    await this.postModel.findByIdAndDelete(postId, { data });

    return { message: 'Post updated ' };
  }

  async deletePost(postId: string) {
    if (!mongoose.isValidObjectId(postId))
      return new NotFoundException('Post not found');

    await this.postModel.findByIdAndDelete(postId, { isDeleted: true });

    return { message: 'Post deleted' };
  }

  async postReaction(userId: string, postId: string, reaction: boolean) {
    if (!mongoose.isValidObjectId(postId))
      return new NotFoundException('Post not found');

    let userReaction = { like: reaction ? 1 : 0, dislike: reaction ? 0 : 1 };
    const userReacted = await this.reactionModel.findOne(
      { user: userId, post: postId },
      'reaction',
    );
    if (userReacted) {
      userReaction = {
        like: userReacted.reaction && reaction ? -1 : 1,
        dislike: reaction && !userReacted.reaction ? -1 : 1,
      };

      await Promise.all([
        this.postModel.findByIdAndUpdate(postId, {
          $inc: { like: userReaction.like, dislike: userReaction.dislike },
        }),
        this.reactionModel.create({ post: postId, user: userId, reaction }),
      ]);

      return { message: 'User reacted successfully' };
    }
  }

  async addComment(
    postId: string,
    userId: string,
    comment: string,
    commentId: string,
  ) {
    if (!mongoose.isValidObjectId(postId))
      return new NotFoundException('Post not found');

    if (!commentId)
      await this.commentModel.create({ user: userId, comment, post: postId });
    else {
      if (!mongoose.isValidObjectId(commentId))
        return new NotFoundException('Comment not found');

      const id = new Types.ObjectId(commentId);
      const commentData = await this.commentModel.findById(
        commentId,
        'replies',
      );
      commentData.replies.push(id);

      await Promise.all([
        this.commentModel.findByIdAndUpdate(commentId, commentData),
        this.commentModel.create({ user: userId, comment, post: postId }),
      ]);
    }

    return { message: 'Comment added successfully' };
  }
}
