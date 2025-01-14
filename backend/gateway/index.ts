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
  interval: '7d',
  path: logDirectory,
});

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));


app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


const targets = {
  authentication: process.env.AUTHENTICATION_API_BASE_URL,
  businessOwner: process.env.BUSINESS_OWNER_API_BASE_URL,
  superAdmin: process.env.SUPER_ADMIN_API_BASE_URL,
  manager: process.env.MANAGER_API_BASE_URL,
  employee: process.env.EMPLOYEE_API_BASE_URL,
  payment: process.env.PAYMENT_API_BASE_URL,
  chatService: process.env.CHAT_API_BASE_URL
};

console.log("Targets:sssjkubgbjkhsds ", targets.payment);
console.log("Targets:sssjkubgbjkhsds ", targets.payment);

app.use('/authentication', createProxyMiddleware({ target: targets.authentication, changeOrigin: true}));
app.use('/businessOwner', createProxyMiddleware({ target: targets.businessOwner, changeOrigin: true}));
app.use('/superAdmin', createProxyMiddleware({ target: targets.superAdmin, changeOrigin: true}));
app.use('/manager', createProxyMiddleware({ target: targets.manager, changeOrigin: true}));
app.use('/employee', createProxyMiddleware({ target: targets.employee, changeOrigin: true }));
app.use('/payment', createProxyMiddleware({ target: targets.payment, changeOrigin: true}));
app.use('/chatService', createProxyMiddleware({ target: targets.chatService, changeOrigin: true}));

const port = process.env.GATEWAY_PORT 
app.listen(port, () => console.log(`Gateway server running on http://localhost:${port}`.bgMagenta.bold));
