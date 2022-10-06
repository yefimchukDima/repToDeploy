import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.entity';

@Entity({
    name: 'password_reset_token'
})
export default class PasswordResetTokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @ManyToOne(() => UserEntity, (u) => u.passwordResetTokens)
    user: UserEntity;
}
