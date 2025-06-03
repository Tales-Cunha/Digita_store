import { testDatabaseConnection } from '../config/database';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Digital Store Backend is alive!');
});

const startServer = async () => {
  await testDatabaseConnection();

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('💥[server]: Failed to start server', error);
  process.exit(1);
});
