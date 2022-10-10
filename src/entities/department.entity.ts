import { IsEmail, IsUrl } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import CompanyEntity from './company.entity';

@Entity({
  name: 'department',
})
export default class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  department?: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  name?: string;

  @Column()
  phone_number: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({
    nullable: true,
  })
  @IsUrl()
  image_url?: string;

  @Column({
    nullable: true,
  })
  button_text?: string;

  @Column({
    nullable: true,
  })
  button_color?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => CompanyEntity, (c) => c.departments)
  company: CompanyEntity;
}
