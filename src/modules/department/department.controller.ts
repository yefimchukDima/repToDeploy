import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import DepartmentEntity from 'src/entities/department.entity';
import JWTGuard from '../auth/guards/jwt.guard';
import DepartmentService from './department.service';
import CreateDepartmentDTO from './dto/create.dto';
import EditDepartmentDTO from './dto/edit.dto';

@Controller('departments')
export default class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a department' })
  @ApiResponse({
    type: DepartmentEntity,
  })
  async createDepartment(
    @Body() data: CreateDepartmentDTO,
  ): Promise<DepartmentEntity> {
    const department = await this.departmentService.createDepartment(data);

    return department;
  }

  @UseGuards(JWTGuard)
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({
    type: [DepartmentEntity],
  })
  @Get()
  async getAllDepartments(): Promise<DepartmentEntity[]> {
    const departments = await this.departmentService.getAll({
      relations: {
        company: true,
      },
    });

    return departments;
  }

  @UseGuards(JWTGuard)
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiResponse({
    type: DepartmentEntity,
  })
  @Get('/get/id/:departmentId')
  async getDepartmentById(
    @Param('departmentId') id: number,
  ): Promise<DepartmentEntity> {
    const department = await this.departmentService.getOneBy({
      id,
    });

    return department;
  }

  @UseGuards(JWTGuard)
  @ApiOperation({ summary: 'Get a departement by phone number' })
  @ApiResponse({
    type: DepartmentEntity,
  })
  @Get('/get/phone/:phone')
  async getDepartmentByPhone(
    @Param('phone') phone: string,
  ): Promise<DepartmentEntity> {
    const department = await this.departmentService.getOneBy({
      phone_number: phone,
    });

    return department;
  }

  @UseGuards(JWTGuard)
  @ApiOperation({ summary: 'Edit a department' })
  @ApiResponse({
    type: DepartmentEntity,
  })
  @Patch('/edit/:departmentId')
  async editDepartment(
    @Param('departmentId') id: number,
    @Body() data: EditDepartmentDTO,
  ): Promise<DepartmentEntity> {
    const department = await this.departmentService.editDepartment(id, data);

    return department;
  }
}
