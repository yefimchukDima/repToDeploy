import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CompanyEntity from './company.entity';
import UserEntity from './user.entity';

@Entity({
  name: 'department',
})
export default class DepartmentEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  department?: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  name?: string;

  @ApiProperty()
  @Column()
  phone_number: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  @IsUrl()
  image_url?: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => CompanyEntity })
  @ManyToOne(() => CompanyEntity, (c) => c.departments)
  company: CompanyEntity;

  @ManyToOne(() => UserEntity, (u) => u.departments)
  user: DepartmentEntity;
}
