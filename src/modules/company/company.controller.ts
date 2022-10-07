import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CompanyEntity from 'src/entities/company.entity';
import JWTGuard from '../auth/guards/jwt.guard';
import CompanyService from './company.service';
import CreateCompanyDTO from './dto/create.dto';
import EditCompanyDTO from './dto/edit.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('companies')
export default class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create')
  async createCompany(@Body() data: CreateCompanyDTO): Promise<CompanyEntity> {
    const company = await this.companyService.createCompany(data);

    return company;
  }

  @UseGuards(JWTGuard)
  @Get()
  async getAllCompanies(): Promise<CompanyEntity[]> {
    const companies = await this.companyService.getAll();

    return companies;
  }

  @UseGuards(JWTGuard)
  @Get('/get/id/:companyId')
  async getCompanyById(@Param('companyId') id: number): Promise<CompanyEntity> {
    const company = await this.companyService.getOneBy({
      id,
    });

    return company;
  }

  @UseGuards(JWTGuard)
  @Get('/get/phone/:phone')
  async getCompanyByPhone(
    @Param('phone') phone: string,
  ): Promise<CompanyEntity> {
    const company = await this.companyService.getOneBy({
      mobile_number: phone,
    });

    return company;
  }

  @UseGuards(JWTGuard)
  @Patch('/edit/:companyId')
  async editCompany(
    @Param('companyId') id: number,
    @Body() data: EditCompanyDTO,
  ): Promise<CompanyEntity> {
    const company = await this.companyService.editCompany(id, data);

    return company;
  }
}
