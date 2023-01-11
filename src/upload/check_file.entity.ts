import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CheckFile {
  @PrimaryGeneratedColumn()
  index: number;

  @Column()
  hash: string;

  @Column('datetime', {default:() => 'CURRENT_TIMESTAMP'})
  check_time: number;

  @Column('datetime', {default:() => 'CURRENT_TIMESTAMP'})
  last_check_time: number;
}