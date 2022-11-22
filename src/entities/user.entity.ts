import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ChatMessageEntity from './chat_message.entity';
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

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  email?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  username?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  mobile_number?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  @Exclude()
  password?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  first_name?: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  last_name?: string;

  @ApiProperty()
  @Column({
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty()
  @Column({
    default: false,
  })
  isRegistered: boolean;

  @ApiProperty()
  @Column({
    default: false,
  })
  isVerified: boolean;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
  })
  base64_image?: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => [VerificationCodeEntity] })
  @OneToMany(() => VerificationCodeEntity, (vc) => vc.user)
  verificationCodes: VerificationCodeEntity[];

  @ApiProperty({ type: () => [PasswordResetTokenEntity] })
  @OneToMany(() => PasswordResetTokenEntity, (prt) => prt.user)
  passwordResetTokens: PasswordResetTokenEntity[];

  @ApiProperty({ type: () => [CompanyEntity] })
  @OneToMany(() => CompanyEntity, (c) => c.user)
  companies: CompanyEntity[];

  @ApiProperty({ type: () => [ChatMessageEntity] })
  @OneToMany(() => ChatMessageEntity, (c) => c.author)
  chatMessages: ChatMessageEntity[];

  @ApiProperty({ type: () => [DepartmentEntity] })
  @OneToMany(() => DepartmentEntity, (d) => d.user)
  departments: DepartmentEntity[];

  @ApiProperty({ type: () => [UserEntity] })
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'user_contacts',
  })
  contacts: UserEntity[];
}
