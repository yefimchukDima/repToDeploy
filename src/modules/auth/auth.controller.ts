import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import UserLoginDTO from '../user/dto/login.dto';
import AuthService from './auth.service';

type LoginResponse = {
  id: number;
  email?: string;
  mobile_number?: string;
  first_name?: string;
  last_name?: string;
  token: string;
};

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    schema: {
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  async loginUser(@Body() data: UserLoginDTO): Promise<LoginResponse> {
    const { id, email, mobile_number, first_name, last_name } =
      await this.authService.autheticateUser(data.login, data.password);

    const token = await this.jwtService.signAsync({
      id,
      email,
      mobile_number,
      first_name,
      last_name,
    });

    return { id, email, mobile_number, first_name, last_name, token };
  }
}
