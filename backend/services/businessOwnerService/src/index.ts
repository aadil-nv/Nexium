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
import 'colors' ;
import {connectConsumer} from "./events/rabbitmq/connectConsumer"
import cookieParser from 'cookie-parser';
import morgan from 'morgan';  
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';



const app = express(); 
const PORT = process.env.PORT || 3000;
connectDB(); 

const logDirectory = path.resolve(__dirname, './logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


const accessLogStream = createStream('access.log', {
    interval: '7d',
    path: logDirectory,
  });


app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:5173', // replace with your frontend domain
  credentials: true, // Allow cookies to be sent with requests
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
  console.log(`businessOwnerService on http://localhost:${PORT}`.bgBlue.bold);
});

