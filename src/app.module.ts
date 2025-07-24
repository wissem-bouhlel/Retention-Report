import express from 'express';
import retentionRoutes from './routes/retention.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

export const createApp = () => {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/health', (_, res) => res.send('OK'));

  // Swagger docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use('/retention', retentionRoutes);

  return app;
};
