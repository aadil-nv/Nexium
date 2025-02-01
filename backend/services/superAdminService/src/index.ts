import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/connectDB';
import businessOwnerRoutes from './routes/businessOwnerRoute';
import subscriptionRoutes from './routes/subscriptionRoute';
import superAdminRoutes from './routes/superAdminRoute';
import dashboardRoutes from './routes/dashboardRoutes';
import 'colors';
import { connectConsumer } from './events/connectCosumer';
import cookieParser from 'cookie-parser';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';


const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

const logDirectory = path.resolve(__dirname, './logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


// Set up log file rotation
const accessLogStream = createStream('access.log', {
    interval: '7d',
    path: logDirectory,
  });

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
connectDB();

const corsOptions = {
  origin: 'http://www.aadil.online',  
  credentials: true,  
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/businessowner', businessOwnerRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/dashboard',dashboardRoutes)

connectConsumer()

app.listen(PORT, () => {
  console.log(`superAdminService on http://localhost:${PORT}`.bgRed.bold);
});