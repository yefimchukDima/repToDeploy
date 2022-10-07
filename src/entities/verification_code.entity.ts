import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.entity';

@Entity({
  name: 'verification_code',
})
export default class VerificationCodeEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column({
    default: String(Math.floor(new Date().getTime() / 1000) + 300), // 5 minutes
  })
  expTime: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (u) => u.verificationCodes)
  user: UserEntity;
}
