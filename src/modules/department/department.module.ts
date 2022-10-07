import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DepartmentEntity from 'src/entities/department.entity';
import CompanyModule from '../company/company.module';
import DepartmentController from './department.controller';
import DepartmentService from './department.service';
import { DepartmentIdExistsMiddleware } from './middlewares/departmentIdExists';
import { DepartmentPhoneExistsMiddleware } from './middlewares/departmentPhoneExists';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentEntity]), CompanyModule],
  providers: [DepartmentService],
  controllers: [DepartmentController],
})
export default class DepartmentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DepartmentIdExistsMiddleware)
      .forRoutes(
        'departments/get/id/:departmentId',
        'departments/edit/:departmentId',
      );

    consumer
      .apply(DepartmentPhoneExistsMiddleware)
      .forRoutes('departments/get/phone/:phone');
  }
}
