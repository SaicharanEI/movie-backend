import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createDefaultUser(email: string, password: string): Promise<void> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
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
