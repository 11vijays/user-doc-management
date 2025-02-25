import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadModels: true, // Auto-loads all models
  sync: {
    alter: true,
    logging(sql, timing) {},
  },
  logging: (sql) => {
    console.log(`[DB QUERY] ${sql}`);
  },
};
