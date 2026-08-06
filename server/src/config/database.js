import { Sequelize } from 'sequelize';
import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_USER = 'marble_user',
  DB_PASSWORD = 'marble_secure_password',
  DB_NAME = 'marble_db',
  NODE_ENV
} = process.env;

// Create Sequelize instance
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: (msg) => {
        if (NODE_ENV === 'development') {
          logger.debug(`[DB Query] ${msg}`);
        }
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: (NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('sslmode=require') || process.env.DATABASE_URL?.includes('neon.tech')) ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    })
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: parseInt(DB_PORT),
      dialect: 'postgres',
      logging: (msg) => {
        if (NODE_ENV === 'development') {
          logger.debug(`[DB Query] ${msg}`);
        }
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: (NODE_ENV === 'production' || DB_HOST.includes('neon.tech')) ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    });

import pg from 'pg';

export const ensureDatabaseExists = async () => {
  if (process.env.DATABASE_URL || DB_HOST.includes('neon.tech')) return;
  try {
    const client = new pg.Client({
      host: DB_HOST,
      port: parseInt(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: 'postgres',
    });
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]);
    if (res.rowCount === 0) {
      logger.info(`Database '${DB_NAME}' does not exist. Auto-creating database...`);
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      logger.info(`Database '${DB_NAME}' created successfully.`);
    }
    await client.end();
  } catch (err) {
    logger.warn(`Database creation check warning: ${err.message}`);
  }
};

export const connectDB = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    logger.info('PostgreSQL connected successfully via Sequelize.');
    
    // Sync models
    await sequelize.sync({ alter: true });
    logger.info('Database models synced.');
    
    if (NODE_ENV !== 'production') {
      const { seedDatabase } = await import('../database/seed.js');
      await seedDatabase();
    } else {
      const { seedMasterAdmin } = await import('../database/seed.js');
      await seedMasterAdmin();
    }
  } catch (error) {
    logger.error(`PostgreSQL connection failure: ${error.message}`);
    // If not in production, we could allow fallback to SQLite for local development without DB running
    if (process.env.DB_FALLBACK_SQLITE === 'true') {
      logger.warn('Attempting SQLite fallback for database connection...');
    } else {
      process.exit(1);
    }
  }
};

export default sequelize;
