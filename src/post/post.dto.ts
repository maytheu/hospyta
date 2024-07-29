import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class NewPostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  category: string;
}

export class UpdatePostDto extends PartialType(NewPostDto) {}

export class CommemntDto {
  @IsNotEmpty()
  comment: string;
}
