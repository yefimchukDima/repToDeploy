import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import CompanyService from '../company.service';

@Injectable()
export class CompanyPhoneExistsMiddleware implements NestMiddleware {
  constructor(private readonly companyService: CompanyService) {}

  use(
    request: Request<{ phone: string }>,
    response: Response,
    next: NextFunction,
  ): void {
    const {
      params: { phone },
    } = request;

    if (!phone)
      throw new BadRequestException('Company phone number not provided!');

    this.companyService
      .getOneBy({
        mobile_number: phone,
      })
      .then((res) => {
        if (res) next();
        else
          next({
            statusCode: 404,
            message: 'Company not found!',
          });
      })
      .catch((e) => {
        next(e);
      });
  }
}
