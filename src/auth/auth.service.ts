import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { NewUserDto } from './auth.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private cloudinary: CloudinaryService,
  ) {}

  async signup(data: NewUserDto, file: Express.Multer.File) {
    const user = await this.userModel.findOne({ email: data.email }, 'id');
    if (user) return new ConflictException('User already exist');

    const image = await this.cloudinary.uploadImage(file);

    const hashPassword = await bcrypt.hash(data.password, 10);

    await this.userModel.create({ ...data, password: hashPassword, image:image.url });

    return { message: 'User created successfully, please login' };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }, 'password');
    if (!user)
      return new UnauthorizedException('User credentials do not match');

    const comparePassword = await bcrypt.compare(user.password, password);
    if (!comparePassword)
      return new UnauthorizedException('User credentials do not match');

    const payload = { sub: user.id, email: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
