import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import 'colors';
import logger from './utils/logger'; // Import logger

dotenv.config();

const app = express();
app.use(logger);

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

const targets = {
  authentication: process.env.AUTHENTICATION_API_BASE_URL,
  businessOwner: process.env.BUSINESS_OWNER_API_BASE_URL,
  superAdmin: process.env.SUPER_ADMIN_API_BASE_URL,
  manager: process.env.MANAGER_API_BASE_URL,
  employee: process.env.EMPLOYEE_API_BASE_URL,
  payment: process.env.PAYMENT_API_BASE_URL,
  communication: process.env.COMMUNICATION_API_BASE_URL
};

// Set up API Gateway routes
app.use('/authentication-service', createProxyMiddleware({ target: targets.authentication, changeOrigin: true }));
app.use('/businessOwner-service', createProxyMiddleware({ target: targets.businessOwner, changeOrigin: true }));
app.use('/superAdmin-service', createProxyMiddleware({ target: targets.superAdmin, changeOrigin: true }));
app.use('/manager-service', createProxyMiddleware({ target: targets.manager, changeOrigin: true }));
app.use('/employee-service', createProxyMiddleware({ target: targets.employee, changeOrigin: true }));
app.use('/payment-service', createProxyMiddleware({ target: targets.payment, changeOrigin: true }));
app.use('/communication-service', createProxyMiddleware({ target: targets.communication, changeOrigin: true }));

const port = process.env.GATEWAY_PORT;
app.listen(port, () => console.log(`API Gateway running on http://localhost:${port}`.bgMagenta.bold));
