import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;
}

export class LoginUserDto extends PickType(NewUserDto, [
  'email',
  'password',
] as const) {}
