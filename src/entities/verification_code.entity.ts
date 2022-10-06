import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.entity';

@Entity({
    name: 'verification_code'
})
export default class VerificationCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({
    default: String(Math.floor(new Date().getTime() / 1000) + 300), // 5 minutes
  })
  expTime: string;

  @ManyToOne(() => UserEntity, (u) => u.verificationCodes)
  user: UserEntity;
}
