import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import managerRoutes from './routes/managerRouter';
import departmentRoutes from './routes/departmentRouter';
import employeeRoutes from './routes/employeeRouter';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
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

app.listen(PORT, () => {
  console.log(`managerService on http://localhost:${PORT}`);
});
