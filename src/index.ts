import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { createApp } from './app.module';

dotenv.config();

const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    const app = createApp();

    app.listen(port, () => {
      console.log(`✅ Server started at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database init error:', err);
  });
