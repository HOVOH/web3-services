import { DataSource } from 'typeorm';
import { CreatePriceEntriesTable1651086364671 } from '../migrations/1651086364671-CreatePriceEntriesTable';
import 'dotenv/config';

const timescaleDb = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [CreatePriceEntriesTable1651086364671],
});

export default timescaleDb;
