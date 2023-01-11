import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column('datetime', {default: () => "CURRENT_TIMESTAMP"})
    create_time: number

    @Column('datetime', {nullable: true})
    last_login: number
}