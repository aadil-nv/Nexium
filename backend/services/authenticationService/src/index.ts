import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/connectDB';
import superAdminRoutes from './routes/superAdminRoutes';
import businessOwnerRoutes from './routes/businessOwnerRoutes';
import managerRoutes from './routes/managerRoutes';
import 'colors';
import cookieParser from 'cookie-parser'; 
import { connectConsumer } from './events/rabbitmq/connectConsumer';
import employeeRoutes from './routes/employeeRoutes';
import logger from './utils/logger'; 

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(logger); // Use the logger middleware/morgan

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Auth service is running..');
});

app.use('/api/super-admin', superAdminRoutes);
app.use('/api/business-owner', businessOwnerRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/employee', employeeRoutes);

connectConsumer();

app.listen(PORT, () => {
    console.log(`authenticationService on http://localhost:${PORT}v3333333333333333333`.bgGreen.bold);
    console.log("Connected to DB".bgGreen.bold);
});
