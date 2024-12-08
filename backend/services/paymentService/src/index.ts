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

const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not defined

// Connect to the database
connectDB();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',  // Allow frontend from localhost:5173
  credentials: true,               // Allow cookies to be sent
}));

app.use("/webhook", express.raw({ type: 'application/json' }), webhookRouter);
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
