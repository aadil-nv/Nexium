import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/connectDB';
import businessOwnerRoutes from './routes/businessOwnerRoute';
import managerRoutes from './routes/managerRoute';
import employeeRoutes from './routes/employeeRoute';
import subscriptionRoutes from './routes/subscriptionRoute';
import dashboardRoutes from './routes/dashboardRoutes';
import 'colors';
import { connectConsumer } from "./events/rabbitmq/connectConsumer";
import cookieParser from 'cookie-parser';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/business-owner', businessOwnerRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);

connectConsumer();

app.listen(PORT, () => {
  console.log(`businessOwnerService on http://localhost:${PORT}v444444444444`.bgBlue.bold);
});
