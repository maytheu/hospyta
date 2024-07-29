import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentDto, NewPostDto, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';
import { AuthGuard, UserGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('new')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  newPost(
    @Body() newPostDto: NewPostDto,
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.postService.newPost(req.user, newPostDto, file);
  }

  @Get()
  allPost(@Req() req: Request) {
    return this.postService.allPost(req.query);
  }

  @Get(':id')
  post(@Param('id') id: string) {
    return this.postService.post(id);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Param() id: string,
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.postService.updatePost(id, updatePostDto, req.user, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deletePost(@Param() id: string, @Req() req: any) {
    return this.postService.deletePost(id, req.user);
  }

  @Post(':postId/reaction/:reaction')
  @UseGuards(AuthGuard)
  postReaction(
    @Param() reaction: string,
    @Param() post: string,
    @Req() req: any,
  ) {
    const react = reaction === 'true' ? true : false;
    return this.postService.postReaction(req.user, post, react);
  }

  @Post(':postId/comment')
  @UseGuards(AuthGuard)
  addComment(
    @Param() post: string,
    @Req() req: any,
    @Body() commentDto: CommentDto,
  ) {
    return this.postService.addComment(post, req.user, commentDto.comment);
  }

  @Post(':postId/comment/:commentId')
  @UseGuards(AuthGuard)
  addReply(
    @Param() post: string,
    @Param() commentId: string,
    @Req() req: any,
    @Body() commentDto: CommentDto,
  ) {
    return this.postService.addComment(
      post,
      req.user,
      commentDto.comment,
      commentId,
    );
  }
}
