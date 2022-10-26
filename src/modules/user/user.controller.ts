import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import UserEntity from 'src/entities/user.entity';
import JWTGuard from '../auth/guards/jwt.guard';
import ChangePasswordDTO from './dto/change-password.dto';
import CreateUserDTO from './dto/create.dto';
import EditUserDTO from './dto/edit.dto';
import UserHasEmailOrPhoneDTO from './dto/user-has-email-or-phone.dto';
import ValidateCodeDTO from './dto/validate-code.dto';
import ValidatePasswordResetTokenDTO from './dto/validate-password-reset-token.dto';
import VerificationCodeDTO from './dto/verification-code.dto';
import UserService from './user.service';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create an user' })
  @ApiResponse({
    type: UserEntity,
  })
  @Post('/create/user')
  async createUser(@Body() data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userService.createUser(data);

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create a company admin' })
  @ApiResponse({
    type: UserEntity,
  })
  @Post('/create/company-admin')
  async createCompanyAdmin(@Body() data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userService.createCompanyAdmin(data);

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get an user by ID' })
  @ApiResponse({
    type: UserEntity,
  })
  @Get('/get/id/:userId')
  async getUserById(@Param('userId') id: number): Promise<UserEntity> {
    const user = await this.userService.getOneBy({
      id,
    });

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get an user by phone number' })
  @ApiResponse({
    type: UserEntity,
  })
  @Get('/get/phone/:phone')
  async getUserByPhone(@Param('phone') phone: string): Promise<UserEntity> {
    const user = await this.userService.getOneBy({
      mobile_number: phone,
    });

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Edit an user' })
  @UseGuards(JWTGuard)
  @ApiResponse({
    type: UserEntity,
  })
  @Patch('/edit/:userId')
  async editUser(@Param('userId') userId: number, @Body() data: EditUserDTO) {
    const user = await this.userService.editUser(userId, data);

    return user;
  }

  @Post('/generate-verification-code/:phone')
  @ApiOperation({ summary: 'Generate a verification code' })
  @ApiResponse({
    type: VerificationCodeDTO,
  })
  async generateVerificationCode(
    @Param('phone') phone: string,
  ): Promise<VerificationCodeDTO> {
    const code = await this.userService.generateVerificationCode(phone);

    return code;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Validate a normal verification code' })
  @ApiResponse({
    type: UserEntity,
  })
  @Post('/validate-verification-code')
  @HttpCode(200)
  async validateVerificationCode(
    @Body() data: ValidateCodeDTO,
  ): Promise<UserEntity> {
    const user = await this.userService.validateVerificationCode(data);

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Validate a verification code for password resetting',
  })
  @ApiResponse({
    type: ValidatePasswordResetTokenDTO,
  })
  @Post('/validate-verification-code-password-reset')
  @HttpCode(200)
  async validateVerificationCodePasswordReset(
    @Body() data: ValidateCodeDTO,
  ): Promise<ValidatePasswordResetTokenDTO> {
    const token = await this.userService.validateVerificationCodePasswordReset(
      data,
    );

    return token;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/change-password')
  @ApiOperation({ summary: 'Change a user password' })
  @ApiResponse({
    type: UserEntity,
  })
  @HttpCode(200)
  async changePassword(@Body() data: ChangePasswordDTO): Promise<UserEntity> {
    const user = await this.userService.changePassword(data);

    return user;
  }

  @Get('user-has-email-or-phone/:phoneEmail')
  @UseGuards(JWTGuard)
  @ApiOperation({
    summary:
      'Check if user has e-mail or phone number for password resetting on mobile',
  })
  @ApiResponse({
    type: UserHasEmailOrPhoneDTO,
  })
  async userHasEmailOrPhone(
    @Param('phoneEmail') phoneEmail: string,
  ): Promise<UserHasEmailOrPhoneDTO> {
    const res = await this.userService.userHasEmailOrPhone(phoneEmail);

    return res;
  }
}
