import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './docs/swagger.js';
import router from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';
import logger from './config/logger.js';

const app = express();

// 1. HTTP request logging via morgan piped to winston
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// 2. Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows browser loading of static file attachments
}));

const allowedOrigins = [
  'http://localhost:5173', // Vite local development
  'http://localhost:80',   // Docker nginx frontend
  'http://localhost'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(xss());
app.use(hpp());
app.use(compression());

// 3. Rate Limiter (Brute-force protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 4. Static media serving fallback
const projectRoot = path.resolve();
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

// 5. Swagger Docs Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Base API Router Mounting
app.use('/api/v1', router);

// Root route checking server status
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// 7. 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// 8. Global Error Handler Middleware
app.use(errorHandler);

export default app;
export { app };
