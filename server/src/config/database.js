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
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT),
  dialect: 'postgres',
  logging: (msg) => {
    // Log database queries to winston under 'http' or 'debug' level if needed
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
  dialectOptions: NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false // Set to true if certificates are fully configured
    }
  } : {}
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connected successfully via Sequelize.');
    
    // Sync models in development/test
    if (NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      logger.info('Database models synced.');
      
      const { seedDatabase } = await import('../database/seed.js');
      await seedDatabase();
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
