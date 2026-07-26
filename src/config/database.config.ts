// src/config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  synchronize: false, // ALWAYS false in an e-commerce project
  logging: process.env.NODE_ENV === 'development',
}));
