import { Module } from '@nestjs/common';
import { Cloudinary } from './cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [Cloudinary, CloudinaryService],
  imports: [ConfigModule.forRoot()],
  exports: [Cloudinary, CloudinaryService],
})
export class CloudinaryModule {}
