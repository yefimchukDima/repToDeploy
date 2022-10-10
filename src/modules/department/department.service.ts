import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DepartmentEntity from 'src/entities/department.entity';
import {
  CREATING_REGISTER_ERROR,
  EDITING_REGISTER_ERROR,
} from 'src/utils/error-messages';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import CompanyService from '../company/company.service';
import CreateDepartmentDTO from './dto/create.dto';
import EditDepartmentDTO from './dto/edit.dto';

@Injectable()
export default class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepo: Repository<DepartmentEntity>,
    private readonly companyService: CompanyService,
  ) {}

  async getOneBy(
    filter:
      | FindOptionsWhere<DepartmentEntity>
      | FindOptionsWhere<DepartmentEntity>[],
  ): Promise<DepartmentEntity> {
    const res = await this.departmentRepo.findOneBy(filter);

    return res;
  }

  async getAll(filter?: FindManyOptions<DepartmentEntity>): Promise<DepartmentEntity[]> {
    const departments = await this.departmentRepo.find(filter);

    return departments;
  }

  async createDepartment(data: CreateDepartmentDTO): Promise<DepartmentEntity> {
    const department = await this.getOneBy({
      email: data.email,
      department: data.department,
      phone_number: data.phone_number,
    });

    const company = await this.companyService.getOneBy({
      id: data.companyId,
    });

    if (department) throw new ConflictException('Department already exists!');
    if (!company) throw new NotFoundException('Company does not exist!');

    const instance = new DepartmentEntity();

    instance.name = data.name;
    instance.phone_number = data.phone_number;
    instance.title = data.title;
    instance.image_url = data.image_url;
    instance.email = data.email;
    instance.company = company;
    instance.department = data.department;

    try {
      return await this.departmentRepo.save(instance);
    } catch (error) {
      throw new InternalServerErrorException(
        CREATING_REGISTER_ERROR('Department') + error,
      );
    }
  }

  async editDepartment(
    departmentId: number,
    data: EditDepartmentDTO,
  ): Promise<DepartmentEntity> {
    const department = await this.getOneBy({
      id: departmentId,
    });

    department.department = data.department;
    department.email = data.email;
    department.image_url = data.image_url;
    department.name = data.name;
    department.phone_number = data.phone_number;
    department.title = data.title;

    try {
      return await this.departmentRepo.save(department);
    } catch (error) {
      throw new InternalServerErrorException(
        EDITING_REGISTER_ERROR('Department') + error,
      );
    }
  }
}
