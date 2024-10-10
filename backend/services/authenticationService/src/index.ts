import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Config/connectDB';
import adminRoutes from './Routes/adminRoutes';
import 'colors' ;


dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 3000;
connectDB(); 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/admin', adminRoutes); 

app.listen(PORT, () => {
  console.log(`authService is running on http://localhost:${PORT}`.bgGreen.bold);
});
