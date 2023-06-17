import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  todo: string;

  @Column()
  completed: boolean;

  @Column({ type: 'jsonb', nullable: true })
  category: { color: string; label: string } | null;

  @Column()
  priority: number;

  @Column()
  createBy: number;

  @ManyToOne(() => User, (user) => user.todos, { eager: false })
  @JoinColumn({ name: 'createBy' })
  user: User;
}
