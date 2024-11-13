import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/connectDB';
import businessOwnerRoutes from './routes/businessOwnerRoute';
import subscriptionRoutes from './routes/subscriptionRoute';
import superAdminRoutes from './routes/superAdminRoute';
import 'colors';
import { connectConsumer } from './events/connectCosumer';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
connectDB();

const corsOptions = {
  origin: 'http://localhost:5173',  // Replace with the actual origin of your frontend
  credentials: true,  // Allow credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/businessowner', businessOwnerRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/superadmin', superAdminRoutes);

connectConsumer()

app.listen(PORT, () => {
  console.log(`superAdminService on http://localhost:${PORT}`.bgRed.bold);
});