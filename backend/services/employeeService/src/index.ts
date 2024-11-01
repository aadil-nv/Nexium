import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
import connectDB from './config/connectDB';
import attendanceRoutes from './routes/attendanceRoute';
import 'colors' ;



const app = express(); 
const PORT = process.env.PORT || 3000;
connectDB(); 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/attendance', attendanceRoutes); 



app.listen(PORT, () => {
  console.log(`employeeService on http://localhost:${PORT}`.bgWhite.bold);
});
