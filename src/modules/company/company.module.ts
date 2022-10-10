import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CompanyEntity from 'src/entities/company.entity';
import UserModule from '../user/user.module';
import CompanyController from './company.controller';
import CompanyService from './company.service';
import { CompanyIdExistsMiddleware } from './middlewares/companyIdExists';
import { CompanyPhoneExistsMiddleware } from './middlewares/companyPhoneExists';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), UserModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export default class CompanyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CompanyIdExistsMiddleware)
      .forRoutes('companies/get/id/:companyId', 'companies/edit/:companyId');

    consumer
      .apply(CompanyPhoneExistsMiddleware)
      .forRoutes('companies/get/phone/:phone');
  }
}
