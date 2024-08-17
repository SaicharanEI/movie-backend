import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";

import { User } from "./user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly logger: Logger,
  ) {}
  SERVICE: string = UserService.name;
  async createDefaultUser(email: string, password: string): Promise<void> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn(`Default user with email ${email} already exists`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
    });

    await user.save();
    this.logger.log(`Default user with email ${email} created successfully`);
  }
}
