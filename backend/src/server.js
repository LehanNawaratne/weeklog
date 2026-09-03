import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';

await connectDB();

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
