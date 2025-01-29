import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import 'colors';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();

const logDirectory = path.resolve(__dirname, './logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


const accessLogStream = createStream('access.log', {
  interval: process.env.LOG_INTERVAL,
  path: logDirectory,
});

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));


app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true , methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }));


const targets = {
  authentication: process.env.AUTHENTICATION_API_BASE_URL,
  businessOwner: process.env.BUSINESS_OWNER_API_BASE_URL,
  superAdmin: process.env.SUPER_ADMIN_API_BASE_URL,
  manager: process.env.MANAGER_API_BASE_URL,
  employee: process.env.EMPLOYEE_API_BASE_URL,
  payment: process.env.PAYMENT_API_BASE_URL,
  communication: process.env.COMMUNICATION_API_BASE_URL
};


app.use('/authentication-service', createProxyMiddleware({ target: targets.authentication, changeOrigin: true}));
app.use('/businessOwner-service', createProxyMiddleware({ target: targets.businessOwner, changeOrigin: true}));
app.use('/superAdmin-service', createProxyMiddleware({ target: targets.superAdmin, changeOrigin: true}));
app.use('/manager-service', createProxyMiddleware({ target: targets.manager, changeOrigin: true}));
app.use('/employee-service', createProxyMiddleware({ target: targets.employee, changeOrigin: true }));
app.use('/payment-service', createProxyMiddleware({ target: targets.payment, changeOrigin: true}));
app.use('/communication-service', createProxyMiddleware({ target: targets.communication, changeOrigin: true}));

const port = process.env.GATEWAY_PORT 
app.listen(port, () => console.log(`api-gateway running on http://localhost:${port}`.bgMagenta.bold));
