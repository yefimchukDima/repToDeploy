import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  department?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  title?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  name?: string;

  @ApiProperty()
  @Column()
  phone_number: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  email?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
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

  @JoinTable({
    name: 'department_users',
  })
  @ManyToMany(() => UserEntity, (u) => u.departments)
  user: DepartmentEntity;
}
