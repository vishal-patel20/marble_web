import app from './app.js';
import { connectDB } from './config/database.js';
import logger from './config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Centralized uncaught error captures
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message} \nStack: ${err.stack}`);
});

// Middleware to lazily ensure database connection on requests in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    logger.error(`Database connection middleware error: ${err.message}`);
    next();
  }
});

// Start standalone Express server if not in a Vercel/Lambda serverless environment
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const startServer = async () => {
    try {
      await connectDB();
      const server = app.listen(PORT, () => {
        logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
      });

      process.on('unhandledRejection', (err) => {
        logger.error(`UNHANDLED REJECTION: ${err.message} \nStack: ${err.stack}`);
        server.close(() => {
          process.exit(1);
        });
      });
    } catch (error) {
      logger.error(`Failed to launch Express application: ${error.message}`);
    }
  };
  startServer();
}

export default app;
