import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import  'colors';



dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({origin: 'http://localhost:5173', credentials: true,}));


const targets = {
  authentication: process.env.AUTHENTICATION_API_BASE_URL,
  businessOwner: process.env.BUSINESS_OWNER_API_BASE_URL,
  superAdmin: process.env.SUPER_ADMIN_API_BASE_URL,
  manager: process.env.MANAGER_API_BASE_URL,
  employee: process.env.EMPLOYEE_API_BASE_URL,
};

// kuhjujkluilksadfgddhgfhfg
// kjbkbkbbgsdfgdfgdfgdfg
app.use("/",(req,res,next)=>{
    console.log("request coming %%%%%%");
    next();
})

app.use('/authentication',createProxyMiddleware({target: targets.authentication,changeOrigin: true,}));
app.use('/businessOwner',createProxyMiddleware({target: targets.businessOwner,changeOrigin: true,}));
app.use('/superAdmin',createProxyMiddleware({ target: targets.superAdmin,changeOrigin: true,}));
app.use('/manager',createProxyMiddleware({target: targets.manager,changeOrigin: true,}));
app.use('/employee',createProxyMiddleware({target: targets.employee,changeOrigin: true,}));


const port = process.env.GATEWAY_PORT || 3000;
app.listen(port, () => console.log(`getaway server running on http://localhost:${port}`.bgMagenta.bold));
