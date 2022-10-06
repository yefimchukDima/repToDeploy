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
import UserEntity from 'src/entities/user.entity';
import JWTGuard from '../auth/guards/jwt.guard';
import ChangePasswordDTO from './dto/change-password.dto';
import CreateUserDTO from './dto/create.dto';
import EditUserDTO from './dto/edit.dto';
import ValidateCodeDTO from './dto/validate-code.dto';
import UserService from './user.service';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/create/user')
  async createUser(@Body() data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userService.createUser(data);

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/create/company-admin')
  async createCompanyAdmin(@Body() data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userService.createCompanyAdmin(data);

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/get/id/:userId')
  async getUserById(@Param('userId') id: number): Promise<UserEntity> {
    const user = await this.userService.getOneBy({
      id,
    });

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/get/phone/:phone')
  async getUserByPhone(@Param('phone') phone: string): Promise<UserEntity> {
    const user = await this.userService.getOneBy({
      mobile_number: phone,
    });

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JWTGuard)
  @Patch('/edit/:userId')
  async editUser(@Param('userId') userId: number, @Body() data: EditUserDTO) {
    const user = await this.userService.editUser(userId, data);

    return user;
  }

  @Post('/generate-verification-code/:phone')
  async generateVerificationCode(
    @Param('phone') phone: string,
  ): Promise<{ code: string }> {
    const code = await this.userService.generateVerificationCode(phone);

    return code;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/validate-verification-code')
  @HttpCode(200)
  async validateVerificationCode(
    @Body() data: ValidateCodeDTO,
  ): Promise<UserEntity> {
    const user = await this.userService.validateVerificationCode(data);

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/validate-verification-code-password-reset')
  @HttpCode(200)
  async validateVerificationCodePasswordReset(
    @Body() data: ValidateCodeDTO,
  ): Promise<{ passwordResetToken: string }> {
    const token = await this.userService.validateVerificationCodePasswordReset(
      data,
    );

    return token;
  }

  @Put('/change-password')
  @HttpCode(200)
  async changePassword(@Body() data: ChangePasswordDTO): Promise<UserEntity> {
    const user = await this.userService.changePassword(data);

    return user;
  }
}
