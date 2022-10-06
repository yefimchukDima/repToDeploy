import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from 'src/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import CreateUserDTO from './dto/create.dto';
import {
  CREATING_REGISTER_ERROR,
  EDITING_REGISTER_ERROR,
  VERIFICATION_CODE_GENERATION,
} from 'src/utils/error-messages';
import { createPassword } from '../auth/utils/create_password';
import EditUserDTO from './dto/edit.dto';
import VerificationCodeEntity from 'src/entities/verification_code.entity';
import ValidateCodeDTO from './dto/validate-code.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(VerificationCodeEntity)
    private readonly verificationCodeRepo: Repository<VerificationCodeEntity>,
  ) {}

  async getOneBy(
    filter: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy(filter);

    return user;
  }

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.getOneBy({
      email: data.email,
      mobile_number: data.mobile_number,
    });

    if (user) throw new ConflictException('User already exists!');

    const instance = new UserEntity();

    instance.email = data.email;
    instance.username = data.username;
    instance.first_name = data.first_name;
    instance.last_name = data.last_name;
    instance.mobile_number = data.mobile_number;
    instance.password = await createPassword(data.password);

    try {
      return await this.userRepo.save(instance);
    } catch (error) {
      throw new InternalServerErrorException(
        CREATING_REGISTER_ERROR('User') + error,
      );
    }
  }

  async createCompanyAdmin(data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.getOneBy({
      email: data.email,
      mobile_number: data.mobile_number,
    });

    if (user) throw new ConflictException('Company admin already exists!');

    const instance = new UserEntity();

    instance.isAdmin = true;
    instance.email = data.email;
    instance.username = data.username;
    instance.first_name = data.first_name;
    instance.last_name = data.last_name;
    instance.mobile_number = data.mobile_number;
    instance.password = await createPassword(data.password);

    try {
      return await this.userRepo.save(instance);
    } catch (error) {
      throw new InternalServerErrorException(
        CREATING_REGISTER_ERROR('Company admin') + error,
      );
    }
  }

  async editUser(userId: number, data: EditUserDTO): Promise<UserEntity> {
    const user = await this.getOneBy({
      id: userId,
    });

    user.email = data.email;
    user.first_name = data.first_name;
    user.isAdmin = data.isAdmin;
    user.last_name = data.last_name;
    user.mobile_number = data.mobile_number;
    user.username = data.username;

    if (data.password) user.password = await createPassword(data.password);

    try {
      return await this.userRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        EDITING_REGISTER_ERROR('User') + error,
      );
    }
  }

  async generateVerificationCode(
    mobile_number: string,
  ): Promise<{ code: string }> {
    const user = await this.getOneBy({
      mobile_number,
    });
    const verificationCode = await this.verificationCodeRepo.findOneBy({
      user: {
        id: user.id,
      },
    });

    if (verificationCode) {
      /* 
      Check if the 5 min expiration time passed, if so, delete it 
      and proceed with creation of another code
      */
      const isExp =
        +verificationCode.expTime - Math.floor(new Date().getTime() / 1000) <=
        0;

      if (!isExp) throw new ConflictException('Code already exists');
      try {
        await this.verificationCodeRepo.remove(verificationCode);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    const instance = new VerificationCodeEntity();

    instance.code = String(code);
    instance.user = user;

    try {
      const res = await this.verificationCodeRepo.save(instance);

      return { code: res.code };
    } catch (e) {
      throw new InternalServerErrorException(VERIFICATION_CODE_GENERATION + e);
    }
  }

  async validateVerificationCode(data: ValidateCodeDTO): Promise<UserEntity> {
    const user = await this.getOneBy({
      mobile_number: data.mobile_number,
    });

    if (!user) throw new NotFoundException('User not found!');

    const verificationCode = await this.verificationCodeRepo.findOneBy({
      user: {
        id: user.id,
      },
    });

    if (!verificationCode) throw new NotFoundException('Code not found!');

    const isExp =
      +verificationCode.expTime - Math.floor(new Date().getTime() / 1000) <= 0;

    if (isExp) throw new BadRequestException('Code expired!');

    if (verificationCode.code !== data.code) {
      throw new UnauthorizedException('Invalid code!');
    }

    try {
      await this.verificationCodeRepo.remove(verificationCode);

      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
