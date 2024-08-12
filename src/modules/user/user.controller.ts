import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { SignUserDto, SignUserSchema } from './dto/sign-user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors()
  async signUser(@Body() createUserDto: SignUserDto): Promise<User> {
    return this.userService.findOne(createUserDto);
  }
}
