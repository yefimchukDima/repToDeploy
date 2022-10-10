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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mobile_number: string;

  @Column()
  website_url: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['call', 'text'],
  })
  button_type: ButtonType;

  @Column({
    type: 'enum',
    enum: ['red', 'orange'],
    nullable: true,
  })
  button_color?: ButtonColor;

  @Column({
    nullable: true,
  })
  button_text?: string;

  @Column({
    type: 'enum',
    enum: ['hover', 'click'],
    nullable: true,
  })
  button_effect?: ButtonEffects;

  @ManyToOne(() => UserEntity, (u) => u.companies)
  user: UserEntity;

  @OneToMany(() => DepartmentEntity, (d) => d.company)
  departments: DepartmentEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
