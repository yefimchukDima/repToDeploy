import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserJwtPayload } from 'types';
import { ConfigService } from '@nestjs/config';
import UserService from 'src/modules/user/user.service';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ id }: UserJwtPayload) {
    const user = await this.userService.getOneBy({
      id,
    });

    return user;
  }
}
