import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CompanyEntity from './company.entity';
import DepartmentEntity from './department.entity';
import PasswordResetTokenEntity from './password_reset_token.entity';
import VerificationCodeEntity from './verification_code.entity';

@Entity({
  name: 'user',
})
export default class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  email: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  username?: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  mobile_number?: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  first_name: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  last_name: string;

  @ApiProperty()
  @Column({
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => VerificationCodeEntity })
  @OneToMany(() => VerificationCodeEntity, (vc) => vc.user)
  verificationCodes: VerificationCodeEntity[];

  @ApiProperty({ type: () => PasswordResetTokenEntity })
  @OneToMany(() => PasswordResetTokenEntity, (prt) => prt.user)
  passwordResetTokens: PasswordResetTokenEntity[];

  @ApiProperty({ type: () => CompanyEntity })
  @OneToMany(() => CompanyEntity, (c) => c.user)
  companies: CompanyEntity[];

  @OneToMany(() => DepartmentEntity, (d) => d.user)
  departments: DepartmentEntity[];
}
