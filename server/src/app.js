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
import './models/index.js';

const app = express();

// 1. CORS Configuration (placed first to handle all origins and preflight requests)
const allowedOrigins = [
  'http://localhost:5173', // Vite local development
  'http://localhost:80',   // Docker nginx frontend
  'http://localhost',
  'https://marble-en.vercel.app',
  'https://marble-web-smoky.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow requests from all frontend domains
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'x-refresh-token',
    'Cache-Control',
    'Pragma'
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 2. HTTP request logging via morgan piped to winston
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// 3. Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows browser loading of static file attachments
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
app.use('/images', express.static(path.join(projectRoot, 'public', 'images')));
app.use('/images', express.static(path.join(projectRoot, '..', 'client', 'public', 'images')));

// 5. Swagger Docs Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Base API Router Mounting
app.use('/api/v1', router);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'MarbleCraft API Backend Service',
    health: '/health',
    docs: '/api-docs',
    version: '1.0.0'
  });
});

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
