import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  alias: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  create_time: string;

  @Column('datetime', { nullable: true })
  last_login: string;
}
