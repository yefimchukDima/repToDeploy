import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import UserEntity from 'src/entities/user.entity';
import UserService from 'src/modules/user/user.service';

@Injectable()
export default class AuthService {
  constructor(private readonly userService: UserService) {}

  async autheticateUser(
    mobile_number: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userService.getOneBy({
      mobile_number,
    });

    if (!user) throw new NotFoundException('User not found');

    await this.verifyPassword(password, user.password);

    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
