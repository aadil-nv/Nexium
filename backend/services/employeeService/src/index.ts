import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'colors';
import logger from './utils/logger'; // Import logger
import { connectConsumer } from './events/connect';

// Import Routes
import attendanceRoutes from './routes/attendanceRoute';
import employeeRoutes from './routes/employeeRoute';
import payrollRoutes from './routes/payrollRoute';
import departmentRoutes from './routes/departmentRoute';
import taskRoutes from './routes/taskRoute';
import dashboardRoutes from './routes/dashboardRoute';
import leaveRoutes from './routes/leaveRoute';
import projectRoutes from './routes/projectRoute';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(logger);
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send('Hello, World!'));
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/project', projectRoutes);

// Start Consumer and Server
connectConsumer();
app.listen(PORT, () => {
  console.log(`employeeService running at http://localhost:${PORT}`.bgWhite.bold);
});
