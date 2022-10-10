import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import DepartmentEntity from './department.entity';
import UserEntity from './user.entity';

@Entity({
  name: 'company',
})
export default class CompanyEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  mobile_number: string;

  @ApiProperty()
  @Column()
  website_url: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (u) => u.companies)
  user: UserEntity;

  @ApiProperty({ type: () => DepartmentEntity })
  @OneToMany(() => DepartmentEntity, (d) => d.company)
  departments: DepartmentEntity[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
