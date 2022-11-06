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
  FindOneOptions,
  FindOptionsWhere,
  Repository,
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
import MessagesService from '../messages/messages.service';

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
    private readonly messagingService: MessagesService,
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

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.getOne({
      where: [{ email: data.email }, { mobile_number: data.mobile_number }],
    });

    if (user) throw new ConflictException('User already exists!');

    const instance = new UserEntity();

    instance.email = data.email;
    instance.username = data.username;
    instance.first_name = data.first_name;
    instance.last_name = data.last_name;
    instance.mobile_number = data.mobile_number;
    instance.password = await createPassword(data.password);
    instance.base64_image = data.base64_image;
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

    instance.isAdmin = true;
    instance.email = data.email;
    instance.username = data.username;
    instance.first_name = data.first_name;
    instance.last_name = data.last_name;
    instance.mobile_number = data.mobile_number;
    instance.password = await createPassword(data.password);
    instance.base64_image = data.base64_image;

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
    user.base64_image = data.base64_image;

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
      const isExp = isVerificationCodeExpired(verificationCode);

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

  async saveUserContacts(userId: number, data: SaveContactsDTO): Promise<void> {
    const user = await this.getOne({
      where: { id: userId },
      relations: {
        contacts: true,
      },
    });

    await this.userRepo.manager.transaction(async (manager: EntityManager) => {
      for (const contact of data.contacts) {
        /* 
          TODO: Download link first hit token validation on API, 
          then go to app store/google play (get app store/google play
          URL and make another request after validation)
        */
        const invitedUser = await this.getOneBy({
          mobile_number: contact,
        });

        if (invitedUser && user.contacts.filter((x) => x.id === invitedUser.id).length)
          throw new ConflictException(
            'Invited user is already on contact list',
          );

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

            newUser.mobile_number = contact;
            newUser.isRegistered = false;

            newUser = await this.userRepo.save(newUser);

            user.contacts = [...user.contacts, newUser];

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

          try {
            await this.messagingService.sendSMS({
              message: `I want to send you a message on SoundGlide! 
              Tap to download: <some link here>
              `,
              phone_number: contact,
            });
          } catch (error) {
            throw new InternalServerErrorException(
              'There was an error during contacts importing: ' + error,
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
