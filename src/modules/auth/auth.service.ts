import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import UserEntity from 'src/entities/user.entity';
import UserService from 'src/modules/user/user.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async autheticateUser(login: string, password: string): Promise<UserEntity> {
    const user = await this.userService.getOne({
      where: [{ email: login }, { mobile_number: login }],
    });

    if (!user) throw new NotFoundException('User not found');

    // TODO: Finish verification code screens and uncomment this lines below
    // if (!user.isVerified)
    //   throw new BadRequestException('You need to verify you account first!');

    await this.verifyPassword(password, user.password);

    return user;
  }

  async getUserFromToken(token: string) {
    try {
      const validToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (validToken) {
        const user = await this.userService.getOneBy({
          id: validToken.id,
        });

        return user;
      }

      throw new NotFoundException('User not found');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
