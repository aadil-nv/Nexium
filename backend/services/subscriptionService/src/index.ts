import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
// import connectDB from './config/connectDB';
// import businessOwnerRoutes from './routes/businessOwnerRoute';
// import subscriptionRoutes from './routes/subscriptionRoute';
import 'colors';
// import { connectConsumer } from './events/connectCosumer';

const app = express();
const PORT = process.env.PORT || 3000;
// connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// app.use('/api/businessowner', businessOwnerRoutes);
// app.use('/api/subscription', subscriptionRoutes);

// connectConsumer()

app.listen(PORT, () => {
  console.log(`subscriptionService on http://localhost:${PORT}`.bgWhite.bold);
});