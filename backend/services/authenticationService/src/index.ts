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
import {connectConsumer}from './events/rabbitmq/connectConsumer';


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({origin: 'http://localhost:5173', credentials: true, }));

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.get('/', (req, res) => {res.send('Auth service is running..');});
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/business-owner', businessOwnerRoutes);
app.use('/api/manager', managerRoutes);

connectConsumer()

app.listen(PORT, () => {console.log(`authenticationService  on http://localhost:${PORT}`.bgGreen.bold)});
