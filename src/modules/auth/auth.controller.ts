import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from '@nestjs/swagger';
import CompanyAdminLoginDTO from '../company_admin/dto/login.dto';
import UserLoginDTO from '../user/dto/login.dto';
import AuthService from './auth.service';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login/user')
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
  async loginUser(@Body() data: UserLoginDTO): Promise<{ token: string }> {
    const { id, email, mobile_number, first_name, last_name } =
      await this.authService.autheticateUser(data.mobile_number, data.password);

    const token = await this.jwtService.signAsync({
      id,
      email,
      mobile_number,
      first_name,
      last_name,
    });

    return { token };
  }

  @Post('login/company-admin')
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
  async loginCompanyAdmin(
    @Body() data: CompanyAdminLoginDTO,
  ): Promise<{ token: string }> {
    const { id, email, first_name, last_name } =
      await this.authService.autheticateCompanyAdmin(data.email, data.password);

    const token = await this.jwtService.signAsync({
      id,
      email,
      first_name,
      last_name,
    });

    return { token };
  }
}
