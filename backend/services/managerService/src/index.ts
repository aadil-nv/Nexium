import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import managerRoutes from './routes/managerRouter';
import departmentRoutes from './routes/departmentRouter';
import employeeRoutes from './routes/employeeRouter';
import onboardingRoutes from './routes/onboardingRouter';
import dashboardRoutes from './routes/dashboardRoutes';
import payrollRoutes from './routes/payrollRoutes';
import { connectConsumer } from './events/connect';

import "colors"
import morgan from 'morgan'; // Import morgan
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import leaveRoutes from './routes/leaveRouter';
import projectRoutes from './routes/projectRoute';
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

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST' , 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/manager', managerRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/leave',leaveRoutes)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/projects', projectRoutes);

connectConsumer();
app.listen(PORT, () => {
  console.log(`managerService on http://localhost:${PORT}`.bgBlue.bold);
});
