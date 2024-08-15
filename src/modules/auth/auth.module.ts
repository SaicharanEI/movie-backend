import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtService } from "./jwt.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/user.schema";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60m" },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [JwtService, JwtAuthGuard, AuthService],
  controllers: [AuthController],
  exports: [JwtService, JwtAuthGuard],
})
export class AuthModule {}
