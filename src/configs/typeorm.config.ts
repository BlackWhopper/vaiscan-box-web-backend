import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const mariadbORMConfig: TypeOrmModuleOptions = {
    type: 'mariadb',
    host: '3.35.205.173',
    port: 3306,
    username: 'blackwhopper',
    password: 'qjrjzld@',
    database: 'vaiscan',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
} 