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
import morgan from 'morgan'; // Import morgan
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT 

connectDB();
const logDirectory = path.resolve(__dirname, './logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


// Set up log file rotation
const accessLogStream = createStream('access.log', {
    interval: process.env.LOG_INTERVAL ,
    path: logDirectory,
  });


app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

app.get('/', (req, res) => {
    res.send('Auth service is running..');
});

app.use('/api/super-admin', superAdminRoutes);
app.use('/api/business-owner', businessOwnerRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/employee', employeeRoutes);

connectConsumer();

app.listen(PORT, () => {
    console.log(`authenticationService on http://localhost:${PORT}`.bgGreen.bold);
    console.log("Connected to DB".bgGreen.bold);
    
});
