import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = registerAs(
  'database',
  (): MongooseModuleOptions => ({
    uri:
      process.env.MONGODB_CONNECTION_STRING ||
      'mongodb://admin:admin@localhost:27017/auth-n-tik_db?authSource=admin',
    // Additional MongoDB connection options
    retryWrites: true,
    w: 'majority',
  }),
);

export const getDatabaseConfig = (): MongooseModuleOptions => ({
  uri:
    process.env.MONGODB_CONNECTION_STRING ||
    'mongodb://admin:admin@localhost:27017/auth-n-tik_db?authSource=admin',
  retryWrites: true,
  w: 'majority',
});
