import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUserDto } from '../user/dto/sign-user.dto';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';

@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() signUserDto: SignUserDto) {
    console.log(signUserDto, 'signUserDto');
    const { email, password, rememberMe } = signUserDto;
    const data = await this.authService.login(email, password, rememberMe);
    if (data) {
      return {
        statusCode: 200,
        message: 'Login successful',
        access_token: data.access_token,
      };
    }
  }
}
