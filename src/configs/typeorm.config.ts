import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

const mariaDB = config.get('mariadb');

export const mariadbORMConfig: TypeOrmModuleOptions = {
    type: mariaDB.type,
  host: process.env.MARIA_HOSTNAME || mariaDB.host,
  port: process.env.MARIA_PORT || mariaDB.port,
  username: process.env.MARIA_USERNAME || mariaDB.username,
  password: process.env.MARIA_PASSWORD || mariaDB.password,
  database: process.env.MARIA_DATABASE || mariaDB.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: mariaDB.synchronize
} 