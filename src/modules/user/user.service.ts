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
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import CreateUserDTO from './dto/create.dto';
import {
  CREATING_REGISTER_ERROR,
  DELETING_REGISTER_ERROR,
  EDITING_REGISTER_ERROR,
  GETTING_REGISTER_ERROR,
  PASSWORD_EDITION,
  VERIFICATION_CODE_GENERATION,
} from 'src/utils/error-messages';
import { createPassword } from '../auth/utils/create_password';
import EditUserDTO from './dto/edit.dto';
import VerificationCodeEntity from 'src/entities/verification_code.entity';
import ValidateCodeDTO from './dto/validate-code.dto';
import isVerificationCodeExpired, {
  MILLISECONDS_TO_SECONDS,
} from 'src/utils/isVerificationCodeExpired';
import PasswordResetTokenEntity from 'src/entities/password_reset_token.entity';
import ChangePasswordDTO from './dto/change-password.dto';
import UserHasEmailOrPhoneDTO from './dto/user-has-email-or-phone.dto';
import SaveContactsDTO from './dto/save-contacts.dto';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

const FIVE_MIN_TO_SECS = 300;

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(VerificationCodeEntity)
    private readonly verificationCodeRepo: Repository<VerificationCodeEntity>,
    @InjectRepository(PasswordResetTokenEntity)
    private readonly passwordResetTokenRepo: Repository<PasswordResetTokenEntity>,
  ) {}

  async getOneBy(filter: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    try {
      const user = await this.userRepo.findOneBy(filter);

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        GETTING_REGISTER_ERROR('user') + error,
      );
    }
  }

  async getOne(filter: FindOneOptions<UserEntity>): Promise<UserEntity> {
    try {
      const user = await this.userRepo.findOne(filter);

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        GETTING_REGISTER_ERROR('user') + error,
      );
    }
  }

  async paginateRepo(
    options: IPaginationOptions,
    where?: FindManyOptions<UserEntity>,
  ): Promise<Pagination<UserEntity>> {
    return paginate<UserEntity>(this.userRepo, options, where);
  }

  async paginateQB(
    qb: SelectQueryBuilder<UserEntity>,
    options: IPaginationOptions,
  ): Promise<Pagination<UserEntity>> {
    return paginate<UserEntity>(qb, options);
  }

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.getOne({
      where: [{ email: data.email }, { mobile_number: data.mobile_number }],
    });

    if (user) throw new ConflictException('User already exists!');

    const instance = new UserEntity();

    Object.keys(data).forEach((key) => {
      instance[key] = data[key];
    });

    if (data.password) instance.password = await createPassword(data.password);

    instance.first_name = data.mobile_number;
    instance.isRegistered = true;

    try {
      return await this.userRepo.save(instance);
    } catch (error) {
      throw new InternalServerErrorException(
        CREATING_REGISTER_ERROR('User') + error,
      );
    }
  }

  async createCompanyAdmin(data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.getOne({
      where: [{ email: data.email }, { mobile_number: data.mobile_number }],
    });

    if (user) throw new ConflictException('Company admin already exists!');

    const instance = new UserEntity();

    Object.keys(data).forEach((key) => {
      instance[key] = data[key];
    });

    if (data.password) instance.password = await createPassword(data.password);

    instance.isAdmin = true;

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

    Object.keys(user).forEach((key) => {
      if (data[key]) user[key] = data[key];
    });

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

    if (user) {
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
        const isExp = isVerificationCodeExpired(verificationCode);

        if (!isExp) throw new ConflictException('Code already exists');
        try {
          await this.verificationCodeRepo.remove(verificationCode);
        } catch (e) {
          throw new InternalServerErrorException(e);
        }
      }
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    const instance = new VerificationCodeEntity();

    instance.code = String(code);
    instance.user = user;
    instance.expTime = String(
      Math.floor(new Date().getTime() / MILLISECONDS_TO_SECONDS) +
        FIVE_MIN_TO_SECS,
    );

    try {
      const res = await this.verificationCodeRepo.save(instance);

      return { code: res.code };
    } catch (e) {
      throw new InternalServerErrorException(VERIFICATION_CODE_GENERATION + e);
    }
  }

  // Normal code verification
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

    const isExp = isVerificationCodeExpired(verificationCode);

    if (isExp) throw new BadRequestException('Code expired!');

    if (verificationCode.code !== data.code) {
      throw new UnauthorizedException('Invalid code!');
    }

    try {
      await this.verificationCodeRepo.remove(verificationCode);

      user.isVerified = true;

      await this.userRepo.save(user);

      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  // Code verification for password resetting
  async validateVerificationCodePasswordReset(
    data: ValidateCodeDTO,
  ): Promise<{ passwordResetToken: string }> {
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

    const isExp = isVerificationCodeExpired(verificationCode);

    if (isExp) throw new BadRequestException('Code expired!');

    if (verificationCode.code !== data.code) {
      throw new UnauthorizedException('Invalid code!');
    }

    try {
      await this.verificationCodeRepo.remove(verificationCode);

      const instance = new PasswordResetTokenEntity();

      instance.token = await createPassword(user.mobile_number);
      instance.user = user;

      const resetToken = await this.passwordResetTokenRepo.save(instance);

      return { passwordResetToken: resetToken.token };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async changePassword(data: ChangePasswordDTO): Promise<UserEntity> {
    const token = await this.passwordResetTokenRepo.findOne({
      where: {
        token: data.resetToken,
      },
      relations: {
        user: true,
      },
    });

    if (!token) throw new NotFoundException('Token not found!');

    try {
      const user = await this.editUser(token.user.id, {
        ...token.user,
        password: data.newPassword,
      });

      await this.passwordResetTokenRepo.remove(token);

      return user;
    } catch (e) {
      throw new InternalServerErrorException(PASSWORD_EDITION + e);
    }
  }

  async userHasEmailOrPhone(
    phoneEmail: string,
  ): Promise<UserHasEmailOrPhoneDTO> {
    const user = await this.getOne({
      where: [{ mobile_number: phoneEmail }, { email: phoneEmail }],
    });

    return {
      email: !!user.email,
      phone: !!user.mobile_number,
    };
  }

  async getUserContacts(userId: number): Promise<UserEntity[]> {
    const user = await this.getOne({
      where: {
        id: userId,
      },
      relations: {
        contacts: true,
      },
    });

    return user.contacts;
  }

  async getUserContactsPagination(
    userId: number,
    paginationOptions: IPaginationOptions,
    query?: string,
  ): Promise<Pagination<UserEntity, IPaginationMeta>> {
    let contacts: SelectQueryBuilder<UserEntity>;

    if (query) {
      contacts = await this.userRepo
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.contacts', 'contact', 'user.id = :userId', {
          userId,
        })
        .where(
          `
          contact."first_name" = :query 
          OR contact."last_name" = :query 
          OR contact.username = :query
          OR contact."mobile_number" = :query
          OR contact.email = :query`,
          { query },
        )
        .orderBy('user.id');
    } else {
      contacts = await this.userRepo
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.contacts', 'contact', 'user.id = :userId', {
          userId,
        })
        .orderBy('user.id');
    }

    try {
      let res = await this.paginateQB(contacts, paginationOptions);

      res = {
        ...res,
        items: res.items.flatMap((x) =>
          x.contacts.flatMap((y) => {
            delete y.password;

            return y;
          }),
        ),
      };

      return res;
    } catch (e) {
      throw new InternalServerErrorException(
        'There was an error on getting contacts by pagination: ' + e,
      );
    }
  }

  async inviteContacts(
    userId: number,
    contacts: number[],
  ): Promise<{ error: string }> {
    const user = await this.getOne({
      where: {
        id: userId,
      },
      relations: {
        contacts: true,
      },
    });

    const existing = [];
    const notExisted = [];

    for (const contact of contacts) {
      const exists = await this.getOneBy({
        id: contact,
      });

      if (!exists) {
        notExisted.push(contact);
      } else {
        existing.push(contact);
      }
    }

    try {
      user.contacts = [...user.contacts, ...existing];

      await this.userRepo.save(user);

      if (notExisted.length) {
        return {
          error: `The following ID's don't exist: ${notExisted.toString()}`,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error adding contact to user list: ' + error,
      );
    }
  }

  async saveUserContacts(
    userId: number,
    data: SaveContactsDTO[],
  ): Promise<void> {
    const user = await this.getOne({
      where: { id: userId },
      relations: {
        contacts: true,
      },
    });

    await this.userRepo.manager.transaction(async (manager: EntityManager) => {
      for (const { phone, avatar } of data) {
        /* 
          TODO: Download link first hit token validation on API, 
          then go to app store/google play (get app store/google play
          URL and make another request after validation)
        */
        const invitedUser = await this.getOneBy({
          mobile_number: phone,
        });

        if (
          invitedUser &&
          user.contacts.filter((x) => x.id === invitedUser.id).length
        )
          continue;

        if (invitedUser) {
          user.contacts = [...user.contacts, invitedUser];

          try {
            await manager.save(user);
          } catch (error) {
            throw new InternalServerErrorException(
              'There was an error during contact saving: ' + error,
            );
          }
        } else {
          try {
            let newUser = new UserEntity();

            Object.keys(data).forEach((key) => {
              if (data[key]) newUser[key] = data[key];
            });

            newUser.isRegistered = false;
            newUser.base64_image = avatar;
            newUser.mobile_number = phone;

            try {
              newUser = await this.userRepo.save(newUser);

              user.contacts = [...user.contacts, newUser];
            } catch (error) {
              throw new InternalServerErrorException(
                'There was an error during adding contact to list: ' + error,
              );
            }

            try {
              await manager.save(user);
            } catch (error) {
              throw new InternalServerErrorException(
                'There was an error during contact saving: ' + error,
              );
            }
          } catch (error) {
            throw new InternalServerErrorException(
              CREATING_REGISTER_ERROR('user') + error,
            );
          }
        }
      }
    });
  }

  async removeContactFromUser(
    userId: number,
    contactId: number,
  ): Promise<void> {
    const user = await this.getOne({
      where: {
        id: userId,
      },
      relations: {
        contacts: true,
      },
    });

    const contact = await this.getOneBy({
      id: contactId,
    });

    if (!contact) throw new NotFoundException('Contact not found!');

    user.contacts = user.contacts.filter((x) => x.id !== contactId);

    try {
      await this.userRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        DELETING_REGISTER_ERROR('contact') + error,
      );
    }
  }
}
