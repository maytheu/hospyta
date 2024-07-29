import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewPostDto } from './post.dto';
import { PostService } from './post.service';
import { AuthGuard } from 'src/auth/auth.guard';
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
}
