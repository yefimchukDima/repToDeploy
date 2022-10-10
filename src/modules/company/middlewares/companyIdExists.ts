import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import CompanyService from '../company.service';

@Injectable()
export class CompanyIdExistsMiddleware implements NestMiddleware {
  constructor(private readonly companyService: CompanyService) {}

  use(
    request: Request<{ companyId: number }>,
    response: Response,
    next: NextFunction,
  ): void {
    const {
      params: { companyId },
    } = request;

    if (!companyId) throw new BadRequestException('Company id not provided!');

    this.companyService
      .getOneBy({
        id: companyId,
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
