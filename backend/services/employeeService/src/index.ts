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
import taskRoutes from './routes/taskRoute';
import dashboardRoutes from './routes/dashboardRoute';
import leaveRoutes from './routes/leaveRoute';
import 'colors' ;
import morgan from 'morgan'; // Import morgan
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import { connectConsumer } from './events/connect';
import projectRoutes from './routes/projectRoute';



const app = express(); 
const PORT = process.env.PORT || 3000;

const logDirectory = path.resolve(__dirname, './logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


// Set up log file rotation
const accessLogStream = createStream('access.log', {
    interval: process.env.LOG_INTERVAL,
    path: logDirectory,
  });


app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
// connectDB(); 

app.use(cors({
  origin: process.env.CLIENT_ORIGIN, // replace with your frontend domain
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
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
app.use('/api/task', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave',leaveRoutes);
app.use('/api/project',projectRoutes)



connectConsumer();
app.listen(PORT, () => {
  console.log(`employeeService on http://localhost:${PORT}`.bgWhite.bold);
});
