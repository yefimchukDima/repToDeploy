import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyEntity from 'src/entities/company.entity';
import {
  CREATING_REGISTER_ERROR,
  EDITING_REGISTER_ERROR,
} from 'src/utils/error-messages';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import UserService from '../user/user.service';
import CreateCompanyDTO from './dto/create.dto';
import EditCompanyDTO from './dto/edit.dto';

@Injectable()
export default class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    private readonly userService: UserService,
  ) {}

  async getOneBy(
    filter: FindOptionsWhere<CompanyEntity> | FindOptionsWhere<CompanyEntity>[],
  ): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOneBy(filter);

    return company;
  }

  async getAll(
    filter?: FindManyOptions<CompanyEntity>,
  ): Promise<CompanyEntity[]> {
    const departments = await this.companyRepo.find(filter);

    return departments;
  }

  async createCompany(data: CreateCompanyDTO): Promise<CompanyEntity> {
    const company = await this.getOneBy({
      name: data.name,
      mobile_number: data.mobile_number,
    });

    const user = await this.userService.getOneBy({
      id: data.userId,
    });

    if (company) throw new ConflictException('Company already exists!');
    if (!user) throw new NotFoundException('User not found!');

    const instance = new CompanyEntity();

    instance.name = data.name;
    instance.mobile_number = data.mobile_number;
    instance.website_url = data.website_url;
    instance.user = user;

    try {
      return await this.companyRepo.save(instance);
    } catch (error) {
      throw new InternalServerErrorException(
        CREATING_REGISTER_ERROR('Company') + error,
      );
    }
  }

  async editCompany(
    companyId: number,
    data: EditCompanyDTO,
  ): Promise<CompanyEntity> {
    const company = await this.getOneBy({
      id: companyId,
    });

    company.name = data.name;
    company.website_url = data.website_url;
    company.mobile_number = data.mobile_number;

    try {
      return await this.companyRepo.save(company);
    } catch (error) {
      throw new InternalServerErrorException(
        EDITING_REGISTER_ERROR('Company') + error,
      );
    }
  }
}
