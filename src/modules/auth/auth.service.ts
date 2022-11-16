import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import UserEntity from 'src/entities/user.entity';
import VerificationCodeEntity from 'src/entities/verification_code.entity';
import UserService from 'src/modules/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(VerificationCodeEntity)
    private readonly verificationCodeRepo: Repository<VerificationCodeEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async autheticateUser(login: string, password: string): Promise<UserEntity> {
    const user = await this.userService.getOne({
      where: [{ email: login }, { mobile_number: login }],
    });

    const verificationPending = await this.verificationCodeRepo.findOneBy({
      user: {
        id: user.id,
      },
    });

    if (verificationPending || !user.isVerified)
      throw new BadRequestException('You need to verify you account first!');

    if (!user) throw new NotFoundException('User not found');

    await this.verifyPassword(password, user.password);

    return user;
  }

  async getUserFromToken(token: string) {
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
