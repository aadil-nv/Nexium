import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
// import connectDB from './config/connectDB';
import cookieParser from 'cookie-parser';
import attendanceRoutes from './routes/attendanceRoute';
import employeeRoutes from './routes/employeeRoute';
import 'colors' ;



const app = express(); 
const PORT = process.env.PORT || 3000;
// connectDB(); 

app.use(cors({
  origin: 'http://localhost:5173', // replace with your frontend domain
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json()); 
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/attendance', attendanceRoutes); 
app.use('/api/employee', employeeRoutes); 



app.listen(PORT, () => {
  console.log(`employeeService on http://localhost:${PORT}`.bgWhite.bold);
});
