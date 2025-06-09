import { testDatabaseConnection } from '../config/database';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import sequelizeInstance from '../config/database';
import './models/User'; // This import is here but not being used
import passport = require('passport');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
// Note: For JWT-based authentication (which is typically stateless),
// you usually don't need passport.session().
// passport.session() is used if you're using session-based authentication.
//
app.get('/', (req: Request, res: Response) => {
  res.send('Digital Store Backend is alive!');
});

const startServer = async () => {
  await testDatabaseConnection();

  // Sync all defined models to the DB.
  await sequelizeInstance.sync({ alter: true });
  console.log('All models were synchronized successfully.');

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('💥[server]: Failed to start server', error);
  process.exit(1);
});

