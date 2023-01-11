import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileList {
  @PrimaryGeneratedColumn()
  file_id: number;

  @Column()
  file_name: string;

  @Column()
  original_name: string;

  @Column()
  file_type: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column('datetime')
  upload_time: number;

  @Column('tinyint', {default: 0})
  dynamic_status: number;

  @Column('tinyint', {default: 0})
  static_status: number;

  @Column('varchar')
  hash: string;

  @Column()
  user_id: number;

}