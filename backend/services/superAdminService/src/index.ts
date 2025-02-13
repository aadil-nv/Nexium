import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import 'colors';
import connectDB from './config/connectDB';
import { connectConsumer } from './events/connectCosumer';
import cookieParser from 'cookie-parser';
import logger from './utils/logger'; // Import logger

// Import Routes
import businessOwnerRoutes from './routes/businessOwnerRoute';
import subscriptionRoutes from './routes/subscriptionRoute';
import superAdminRoutes from './routes/superAdminRoute';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Middleware
app.use(logger);
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send('Hello, World!'));
app.use('/api/businessowner', businessOwnerRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start Consumer and Server
connectConsumer();
app.listen(PORT, () => {
  console.log(`superAdminService running at http://localhost:${PORT}`.bgRed.bold);
});
