import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CheckFile {
  @PrimaryGeneratedColumn()
  index: number;

  @Column()
  hash: string;

  @Column('datetime')
  check_time: number;

  @Column('datetime')
  last_check_time: number;
}