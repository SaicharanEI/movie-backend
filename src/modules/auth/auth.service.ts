import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";

import { User } from "../user/user.schema";
import { JwtPayload } from "./jwt-payload.interface";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string, rememberMe: boolean) {
    const user: User = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid Password");
    }
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id,
    };
    const access_token = this.jwtService.generateToken(payload, rememberMe);
    return {
      access_token,
    };
  }
}
