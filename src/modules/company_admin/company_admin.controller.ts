import { Body, Controller, Post } from '@nestjs/common';
import CompanyAdminEntity from 'src/entities/company_admin.entity';
import CompanyAdminService from './company_admin.service';
import CreateCompanyAdminDTO from './dto/create.dto';

@Controller('company-admin')
export default class CompanyAdminController {
  constructor(private readonly companyAdminService: CompanyAdminService) {}

  @Post('create')
  async createUser(
    @Body() data: CreateCompanyAdminDTO,
  ): Promise<CompanyAdminEntity> {
    return await this.companyAdminService.createCompanyAdmin(data);
  }
}
