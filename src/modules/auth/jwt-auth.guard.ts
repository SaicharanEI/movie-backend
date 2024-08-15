import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
      throw new UnauthorizedException("No token provided");
    }

    const [, token] = authHeader.split(" ");
    if (!token) {
      throw new UnauthorizedException("Invalid token");
    }

    try {
      const user = this.jwtService.verifyToken(token);
      console.log(user, "user");
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
