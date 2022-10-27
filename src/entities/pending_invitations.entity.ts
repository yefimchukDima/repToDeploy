import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserEntity from "./user.entity";

@Entity({
    name: 'pending_invitations'
})
export default class PendingInvitationsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone_number: string;

    @Column()
    token: string;

    @ManyToOne(() => UserEntity, (u) => u.pending_invitations)
    user: UserEntity;
}