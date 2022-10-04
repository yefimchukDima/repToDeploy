import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CompanyAdminEntity from 'src/entities/company_admin.entity';
import CompanyAdminController from './company_admin.controller';
import CompanyAdminService from './company_admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyAdminEntity])],
  providers: [CompanyAdminService],
  controllers: [CompanyAdminController],
  exports: [CompanyAdminService],
})
export default class CompanyAdminModule {}
