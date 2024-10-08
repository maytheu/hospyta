import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { Post } from 'src/schemas/post.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) return false;

    const token = (authHeader as string).split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded.sub;

      return true;
    } catch (error) {
      return false;
    }
  }
}

@Injectable()
export class ValidatePost implements CanActivate {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params, user } = request;

    try {
      return this.postModel.findOne({ _id: params.id, user }).then((elem) => {
        if (!elem) return false;
        return true;
      });
    } catch (error) {
      return false;
    }
  }
}
