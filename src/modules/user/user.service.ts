import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../modules/user/user.schema';
import { SignUserDto, SignUserSchema } from './dto/sign-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findOne(SignUserDto: SignUserDto): Promise<User> {
    const parsed = SignUserSchema.safeParse(SignUserDto);

    if (!parsed.success) {
      throw new BadRequestException('Invalid data');
    }

    const { username, password } = parsed.data;

    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== password) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}
