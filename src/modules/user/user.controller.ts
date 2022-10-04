import { Body, Controller, Post } from '@nestjs/common';
import UserEntity from 'src/entities/user.entity';
import CreateUserDTO from './dto/create.dto';
import UserService from './user.service';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() data: CreateUserDTO): Promise<UserEntity> {
    return await this.userService.createUser(data);
  }
}
