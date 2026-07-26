import app from './app.js';
import { connectDB } from './config/database.js';
import logger from './config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Centralized uncaught error captures
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! Shutting down... \nError: ${err.message} \nStack: ${err.stack}`);
  process.exit(1);
});

const startServer = async () => {
  try {
    // Connect database
    await connectDB();

    // Listen
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });

    process.on('unhandledRejection', (err) => {
      logger.error(`UNHANDLED REJECTION! Shutting down... \nError: ${err.message} \nStack: ${err.stack}`);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error(`Failed to launch Express application: ${error.message}`);
    process.exit(1);
  }
};

startServer();
