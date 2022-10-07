import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.entity';

@Entity({
  name: 'password_reset_token',
})
export default class PasswordResetTokenEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  token: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (u) => u.passwordResetTokens)
  user: UserEntity;
}
