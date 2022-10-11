import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CompanyEntity from 'src/entities/company.entity';
import DepartmentEntity from 'src/entities/department.entity';
import UserModule from '../user/user.module';
import CompanyController from './company.controller';
import CompanyService from './company.service';
import { CompanyIdExistsMiddleware } from './middlewares/companyIdExists';
import { CompanyPhoneExistsMiddleware } from './middlewares/companyPhoneExists';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, DepartmentEntity]),
    UserModule,
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export default class CompanyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CompanyIdExistsMiddleware)
      .forRoutes(
        'companies/get/id/:companyId',
        'companies/edit/:companyId',
        'companies/departments/:companyId',
      );

    consumer
      .apply(CompanyPhoneExistsMiddleware)
      .forRoutes('companies/get/phone/:phone');
  }
}
