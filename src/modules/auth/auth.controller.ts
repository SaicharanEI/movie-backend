import { Controller, Post, Body, UseFilters, Logger } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HttpExceptionFilter } from "src/filter/http-exception.filter";

import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-auth.dto";
// import { CustomLoggerService } from "src/logger/logger.service";

@Controller("auth")
@ApiTags("auth")
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  // private readonly logger = new CustomLoggerService();
  constructor(
    private authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Login" })
  @ApiBody({
    schema: {
      example: {
        email: "admin@gmail.com",
        password: "12345678",
        rememberMe: true,
      },
    },
  })
  @ApiResponse({ status: 200, description: "Login successful" })
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password, rememberMe } = loginUserDto;
    const data = await this.authService.login(email, password, rememberMe);
    if (data) {
      return {
        status: 201,
        message: "Login successful",
        access_token: data.access_token,
      };
    }
  }
}
