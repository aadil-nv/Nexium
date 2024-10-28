import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/connectDB';
import superAdminRoutes from './routes/superAdminRoutes';
import businessOwnerRouter from './routes/businessOwnerRoutes';
import 'colors';
import cookieParser from 'cookie-parser'; // Correct import

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // replace with your frontend domain
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

app.get('/', (req, res) => {
  res.send('Hello, World!');
});



app.use('/api/super-admin', superAdminRoutes);
app.use('/api/business-owner', businessOwnerRouter);

app.listen(PORT, () => {
  console.log(`authService is running on http://localhost:${PORT}`.bgGreen.bold);
});
