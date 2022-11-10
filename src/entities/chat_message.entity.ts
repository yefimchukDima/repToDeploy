import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserEntity from './user.entity';

@Entity({
  name: 'chat_message',
})
export default class ChatMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  room: string;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  date: Date;

  @ManyToOne(() => UserEntity, (u) => u.chatMessages)
  author: UserEntity;
}
