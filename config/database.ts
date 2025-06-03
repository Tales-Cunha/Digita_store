import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('error');
  console.error(
    'Please ensure you have a .env file with DATABASE_URL defined (e.g., DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE")'
  );
  process.exit(1); // Exit the process if the database URL is not found
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {},
  // Add SSL configuration here if required by your database provider (e.g., for production on services like Heroku, AWS RDS)
  define: {
    timestamps: true,
    underscored: true, // Use snake_case for automatically generated attributes (e.g., foreign keys)
    // This also applies to table names if not explicitly set.
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export const testDatabaseConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate(); // This is an async operation
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};
