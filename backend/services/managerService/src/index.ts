import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import managerRoutes from './routes/managerRouter';
import departmentRoutes from './routes/departmentRouter';
import employeeRoutes from './routes/employeeRouter';
import dashboardRoutes from './routes/dashboardRoutes';
import payrollRoutes from './routes/payrollRoutes';
import leaveRoutes from './routes/leaveRouter';
import projectRoutes from './routes/projectRoute';
import { connectConsumer } from './events/connect';
import 'colors';
import logger from './utils/logger'; // Import logger

const app = express();
const PORT = process.env.PORT || 3000;

// Apply logging middleware
app.use(logger);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API routes
app.use('/api/manager', managerRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/projects', projectRoutes);

connectConsumer();

app.listen(PORT, () => {
  console.log(`managerService on http://localhost:${PORT}`.bgBlue.bold);
});
