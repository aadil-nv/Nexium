import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/connectDB';
import businessOwnerRoutes from './routes/businessOwnerRoute';
<<<<<<< HEAD
import subscriptionRoutes from './routes/subscriptionRoute';
=======
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
import 'colors';
import { connectConsumer } from './events/connectCosumer';

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/businessowner', businessOwnerRoutes);
<<<<<<< HEAD
app.use('/api/subscription', subscriptionRoutes);
=======
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0

connectConsumer()

app.listen(PORT, () => {
  console.log(`superAdminService on http://localhost:${PORT}`.bgRed.bold);
});