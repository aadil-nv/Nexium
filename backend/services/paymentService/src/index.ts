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

connectDB();

app.use(logger);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true, 
}));

app.use("/webhook", express.raw({ type: 'application/json' }), webhookRouter);

app.use(express.json()); 
app.use(cookieParser()); 

app.get('/', (req, res) => res.send('Hello, World!'));
app.use('/api/businessowner-payment', businessOwnerPaymentRoutes);

app.listen(PORT, () => {
  console.log(`paymentService running at http://localhost:${PORT} v11111111`.bgCyan.bold);
});
