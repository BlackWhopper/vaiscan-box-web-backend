import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  storage_id: number;

  @Column()
  file_name: string;

  @Column()
  original_name: string;

  @Column()
  file_type: string;

  @Column({ nullable: true })
  size: number;

  @Column()
  path: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  upload_time: string;

  @Column('tinyint', { default: 0 })
  dynamic_status: number;

  @Column('tinyint', { default: 0 })
  static_status: number;

  @Column('varchar', { nullable: true })
  hash: string;

  @Column()
  user_id: number;
}
