// src/auth/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: '545admin',
    });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: '545admin',
    });
  }
}
