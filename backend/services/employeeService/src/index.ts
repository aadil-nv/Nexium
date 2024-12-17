import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import attendanceRoutes from './routes/attendanceRoute';
import employeeRoutes from './routes/employeeRoute';
import payrollRoutes from './routes/payrollRoute';
import departmentRoutes from './routes/departmentRoute';
import 'colors' ;
import morgan from 'morgan'; // Import morgan
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';




const app = express(); 
const PORT = process.env.PORT || 3000;

const logDirectory = path.resolve(__dirname, './logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


// Set up log file rotation
const accessLogStream = createStream('access.log', {
    interval: '7d',
    path: logDirectory,
  });


app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
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
app.use('/api/payroll', payrollRoutes);
app.use('/api/department', departmentRoutes);



app.listen(PORT, () => {
  console.log(`employeeService on http://localhost:${PORT}`.bgWhite.bold);
});
