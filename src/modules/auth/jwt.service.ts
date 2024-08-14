// src/auth/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(payload: any, rememberMe: boolean): string {
    return this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '7d' : '2hr',
      secret: process.env.JWT_SECRET,
    });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
