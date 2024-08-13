import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUserDto } from '../user/dto/sign-user.dto';
import { Response as Res } from 'express'; // Rename import to avoid conflict with the Response decorator

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() signUserDto: SignUserDto, @Response() response: Res) {
    console.log(signUserDto, 'signUserDto');
    const { email, password } = signUserDto;

    try {
      const data = await this.authService.login(email, password);
      if (data) {
        response.status(200).json({
          access_token: data.access_token,
          message: 'Login successful',
        });
      } else {
        response.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'An error occurred during login' });
    }
  }
}
