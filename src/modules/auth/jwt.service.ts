import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import {
  JWT_SECRET,
  JWT_EXPIRATION,
  JWT_EXPIRATION_DAYS,
} from "src/constants/jwt.constants";
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(payload: any, rememberMe: boolean): string {
    return this.jwtService.sign(payload, {
      expiresIn: rememberMe ? JWT_EXPIRATION_DAYS : JWT_EXPIRATION,
      secret: JWT_SECRET,
    });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }
}
