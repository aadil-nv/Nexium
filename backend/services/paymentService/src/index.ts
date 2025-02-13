import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB';
import webhookRouter from './routes/webhookRoute';
import businessOwnerPaymentRoutes from './routes/businessOwnerPaymentRoute';
import 'colors';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Logging Middleware
app.use(logger);

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true, 
}));

// Webhook Middleware (Stripe requires raw body)
app.use("/webhook", express.raw({ type: 'application/json' }), webhookRouter);

// Other Middleware
app.use(express.json()); 
app.use(cookieParser()); 

// Test Route
app.get('/', (req, res) => res.send('Hello, World!'));

// Routes
app.use('/api/businessowner-payment', businessOwnerPaymentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`paymentService running at http://localhost:${PORT} v11111111`.bgCyan.bold);
});
