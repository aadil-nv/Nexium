import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import managerRoutes from './routes/managerRouter';
// import departmentRoutes from './routes/departmentRouter';
// import employeeRoutes from './routes/employeeRouter';
// import onboardingRoutes from './routes/onboardingRouter';
import "colors"
import morgan from 'morgan'; 
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
// import leaveRoutes from './routes/leaveRouter';
const app = express();
const PORT = 7006

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
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
})

// app.use('/api/manager', managerRoutes);
// app.use('/api/department', departmentRoutes);
// app.use('/api/employee', employeeRoutes);
// app.use('/api/onboarding', onboardingRoutes);
// app.use('/api/leave',leaveRoutes)

app.listen(PORT, () => {
  console.log(`notificationService on http://localhost:${PORT}`.bgBlue.bold);
});
