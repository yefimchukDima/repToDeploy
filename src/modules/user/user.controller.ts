import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import PendingInvitationsEntity from 'src/entities/pending_invitations.entity';
import UserEntity from 'src/entities/user.entity';
import JWTGuard from '../auth/guards/jwt.guard';
import ChangePasswordDTO from './dto/change-password.dto';
import CreateUserDTO from './dto/create.dto';
import EditUserDTO from './dto/edit.dto';
import ImportContactsDTO from './dto/import-contacts.dto';
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

  @Get('get/contacts/:userId')
  @ApiOperation({ summary: "Get user's contacts" })
  @ApiResponse({
    type: [UserEntity],
  })
  async getUserContacts(
    @Param('userId') userId: number,
  ): Promise<(UserEntity | PendingInvitationsEntity)[]> {
    const contacts = await this.userService.getUserContacts(userId);

    return contacts;
  }

  @Post('import-contacts/:userId')
  @UseGuards(JWTGuard)
  @ApiOperation({ summary: "Import user's contacts" })
  async importUserContacts(
    @Param('userId') userId: number,
    @Body() contacts: ImportContactsDTO,
  ): Promise<void> {
    await this.userService.importUserContacts(userId, contacts);
  }

  @Get('validate-invitation-token')
  @ApiOperation({ summary: 'Validate invitation token' })
  @HttpCode(202)
  async validateInvitationToken(@Query('token') token: string): Promise<void> {
    await this.userService.validateInvitationToken(token);
  }

  @Get('/get/pending-invitations/:userId')
  @UseGuards(JWTGuard)
  @ApiOperation({
    summary: 'Get all pending invitations associated with a user',
  })
  async getUserContactsPendingInvitations(
    @Param('userId') userId: number,
  ): Promise<PendingInvitationsEntity[]> {
    const invitations = await this.userService.getPendingInvitations(userId);

    return invitations;
  }

  @Delete('/remove/contact/:userId/:contactId')
  @UseGuards(JWTGuard)
  @ApiOperation({
    summary: 'Remove a contact from user list',
  })
  async removeContactFromUserList(
    @Param('userId') userId: number,
    @Param('contactId') contactId: number,
  ): Promise<void> {
    await this.userService.removeContactFromUser(userId, contactId);
  }
}
