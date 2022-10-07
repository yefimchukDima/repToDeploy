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

export type ButtonType = 'call' | 'text';
export type ButtonColor = 'red' | 'orange';
export type ButtonEffects = 'hover' | 'click';

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

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ['call', 'text'],
  })
  button_type: ButtonType;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ['red', 'orange'],
    nullable: true,
  })
  button_color?: ButtonColor;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  button_text?: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ['hover', 'click'],
    nullable: true,
  })
  button_effect?: ButtonEffects;

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
