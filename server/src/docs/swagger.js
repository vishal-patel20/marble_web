import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Premium Marble Company API Documentation',
      version: '1.0.0',
      description: 'Production-ready Express & PostgreSQL API specification for managing marble inventories, inquiries, and customer portfolios.',
      contact: {
        name: 'Technical Support Team',
        email: 'info@premiummarbles.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token to authorize access.',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Points to file paths containing annotations
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
