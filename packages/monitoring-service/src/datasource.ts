import { DataSource } from 'typeorm';
import 'dotenv/config';
import { migrations } from '../migrations';
import { Asset } from './assets/entities/asset.entity';
import { PriceSource } from './assets/entities/price-source.entity';

const timescaleDb = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: migrations,
  entities: [Asset, PriceSource],
});

export default timescaleDb;
