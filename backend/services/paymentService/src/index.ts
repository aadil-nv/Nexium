import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB';
import businessOwnerPaymentRoutes from './routes/businessOwnerPaymentRoute';
import webhookRouter from './routes/webhookRoute';
import "colors";
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT  

// Connect to the database
connectDB();

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

// Enable CORS
app.use(cors({
  origin: 'https://www.aadil.online',  // Allow frontend from localhost:5173
  credentials: true,    
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],      
}));

app.use("/webhook", express.raw({ type: 'application/json'}), webhookRouter);
// Middlewares
app.use(express.json());  // Body parser for JSON
app.use(cookieParser());  // Cookie parser for handling cookies

// Root route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Routes
app.use('/api/businessowner-payment', businessOwnerPaymentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`paymentService on http://localhost:${PORT}`.bgCyan.bold);
});
