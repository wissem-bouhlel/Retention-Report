import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Salon Retention API',
      version: '1.0.0',
      description: 'API for generating employee retention reports',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Or .js if you're using compiled files
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
