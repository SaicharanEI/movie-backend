import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from '../user/user.schema';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(email, password);
    const user = await this.userModel.findOne({ email });
    console.log(user);
    if (user && (await user.comparePassword(password))) {
      // if (user) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user: User = await this.userModel.findOne({ email });
    console.log(user, 'user');
    if (!user) {
      throw new UnauthorizedException();
    }
    // const isPsswordValid = await bcrypt.compare(password, user.password);
    // console.log(isPsswordValid, 'isPsswordValid');
    // if (!isPsswordValid) {
    //   throw new UnauthorizedException();
    // }
    const payload: JwtPayload = {
      email: user.email,
      iat: Date.now(),
      sub: user._id,
    };
    return {
      access_token: this.jwtService.generateToken(payload),
    };
  }
}
