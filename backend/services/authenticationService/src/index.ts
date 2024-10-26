import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
import connectDB from './config/connectDB';
import superAdminRoutes from './routes/superAdminRoutes';
import businessOwnerRouter from './routes/businessOwnerRoutes';
import 'colors' ;


const app = express(); 
const PORT = process.env.PORT || 3000;
connectDB(); 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/super-admin', superAdminRoutes); 
app.use('/api/business-owner', businessOwnerRouter); 

app.listen(PORT, () => {
  console.log(`authService is running on http://localhost:${PORT}`.bgGreen.bold);
});
