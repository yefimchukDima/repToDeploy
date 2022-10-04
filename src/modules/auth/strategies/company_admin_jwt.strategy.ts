import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CompanyAdminJwtPayload } from 'types';
import { ConfigService } from '@nestjs/config';
import CompanyAdminService from 'src/modules/company_admin/company_admin.service';

@Injectable()
export class CompanyAdminJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly companyAdminService: CompanyAdminService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ id }: CompanyAdminJwtPayload) {
    return await this.companyAdminService.getOneBy({
      id,
    });
  }
}
