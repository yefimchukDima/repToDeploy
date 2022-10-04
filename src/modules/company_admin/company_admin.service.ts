import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyAdminEntity from 'src/entities/company_admin.entity';
import { CREATING_REGISTER_ERROR } from 'src/utils/error-messages';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPassword } from '../auth/utils/create_password';
import CreateCompanyAdminDTO from './dto/create.dto';

@Injectable()
export default class CompanyAdminService {
  constructor(
    @InjectRepository(CompanyAdminEntity)
    private readonly companyAdminRepo: Repository<CompanyAdminEntity>,
  ) {}

  async getOneBy(
    filter:
      | FindOptionsWhere<CompanyAdminEntity>
      | FindOptionsWhere<CompanyAdminEntity>[],
  ): Promise<CompanyAdminEntity> {
    return await this.companyAdminRepo.findOneBy(filter);
  }

  async createCompanyAdmin(
    data: CreateCompanyAdminDTO,
  ): Promise<CompanyAdminEntity> {
    const user = await this.getOneBy({
      email: data.email,
    });

    if (user) throw new ConflictException('Company admin already exists!');

    const instance = new CompanyAdminEntity();

    instance.email = data.email;
    instance.first_name = data.first_name;
    instance.last_name = data.last_name;
    instance.password = await createPassword(data.password);

    try {
      return await this.companyAdminRepo.save(instance);
    } catch (error) {
      throw new InternalServerErrorException(
        CREATING_REGISTER_ERROR('Company admin') + error,
      );
    }
  }
}
