import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from 'src/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import CreateUserDTO from './dto/create.dto';
import {
  CREATING_REGISTER_ERROR,
  EDITING_REGISTER_ERROR,
} from 'src/utils/error-messages';
import { createPassword } from '../auth/utils/create_password';
import EditUserDTO from './dto/edit.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
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

  async editUser(userId: number, data: EditUserDTO) {
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
      await this.userRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        EDITING_REGISTER_ERROR('User') + error,
      );
    }
  }
}
