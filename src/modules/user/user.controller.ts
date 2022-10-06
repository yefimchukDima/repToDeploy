import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UserEntity from 'src/entities/user.entity';
import RolesDecorator from '../auth/decorators/role.decorator';
import JWTGuard from '../auth/guards/jwt.guard';
import CreateUserDTO from './dto/create.dto';
import EditUserDTO from './dto/edit.dto';
import UserService from './user.service';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create/user')
  async createUser(@Body() data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userService.createUser(data);

    return user;
  }

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

  @UseGuards(JWTGuard)
  @RolesDecorator('admin')
  @Patch('/edit/:userId')
  async editUser(@Param('userId') userId: number, @Body() data: EditUserDTO) {
    const user = await this.userService.editUser(userId, data);

    return user;
  }
}
