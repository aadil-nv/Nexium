import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB';
import businessOwnerPaymentRoutes from './routes/businessOwnerPaymentRoute';

import "colors"

const app = express();
const PORT = process.env.PORT 

connectDB();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/businessowner-payment', businessOwnerPaymentRoutes);


app.listen(PORT, () => {
  console.log(`paymentService on http://localhost:${PORT}`.bgCyan.bold);
});
