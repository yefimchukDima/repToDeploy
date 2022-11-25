import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import UserEntity from 'src/entities/user.entity';
import JWTGuard from '../auth/guards/jwt.guard';
import ChangePasswordDTO from './dto/change-password.dto';
import CreateUserDTO from './dto/create.dto';
import EditUserDTO from './dto/edit.dto';
import SaveContactsDTO from './dto/save-contacts.dto';
import UserHasEmailOrPhoneDTO from './dto/user-has-email-or-phone.dto';
import ValidateCodeDTO from './dto/validate-code.dto';
import ValidatePasswordResetTokenDTO from './dto/validate-password-reset-token.dto';
import VerificationCodeDTO from './dto/verification-code.dto';
import UserService from './user.service';

const MAX_PAGE_LIMIT = 100;

@Controller('users')
export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

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
  ): Promise<UserEntity[]> {
    const contacts = await this.userService.getUserContacts(userId);

    return contacts;
  }

  @Get('get/contacts/:userId/pagination')
  @ApiOperation({ summary: "Get user's contacts via pagination" })
  @ApiResponse({
    type: [UserEntity],
  })
  async getUserContactsPagination(
    @Param('userId') userId: number,
    @Query('query') query?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<UserEntity, IPaginationMeta>> {
    limit = limit > MAX_PAGE_LIMIT ? MAX_PAGE_LIMIT : limit;
    const serverUrl = this.configService.get('SERVER_URL');

    const contacts = await this.userService.getUserContactsPagination(
      userId,
      {
        limit,
        page,
        route: `${serverUrl}/users/get/contacts/${userId}/pagination${
          query ? `?query=${query}` : ''
        }`,
      },
      query,
    );

    return contacts;
  }

  @Post('invite-contacts/:userId')
  @UseGuards(JWTGuard)
  @ApiOperation({ summary: 'Add users to friends list' })
  async inviteContacts(
    @Param('userId') userId: number,
    @Body() data: number[],
  ): Promise<{ error: string }> {
    const res = await this.userService.inviteContacts(userId, data);

    return res;
  }

  @Post('save-contacts/:userId')
  @UseGuards(JWTGuard)
  @ApiOperation({ summary: "Save user's contacts" })
  async saveUserContacts(
    @Param('userId') userId: number,
    @Body(
      new ParseArrayPipe({
        items: SaveContactsDTO,
      }),
    )
    contacts: SaveContactsDTO[],
  ): Promise<void> {
    await this.userService.saveUserContacts(userId, contacts);
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
