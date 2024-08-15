import { Controller, Post, Body, UseFilters } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUserDto } from "../user/dto/sign-user.dto";
import { HttpExceptionFilter } from "src/filter/http-exception.filter";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("auth")
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async login(@Body() signUserDto: SignUserDto) {
    console.log(signUserDto, "signUserDto");
    const { email, password, rememberMe } = signUserDto;
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
