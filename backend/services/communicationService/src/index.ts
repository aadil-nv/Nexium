import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chatRoute';
import "colors";
import morgan from 'morgan'; 
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import { initializeChatSocket } from './config/chatSocket';
import messageRoutes from './routes/messageRoute';
import notificationRoutes from './routes/notificationRoute';
import meetingRoutes from './routes/meetingRoute';

const app = express();
const PORT = process.env.PORT 

// Set up HTTP server and Socket.IO
const server = app.listen(PORT, () => {
  console.log(`communication-service is running on http://localhost:${PORT} v222222222`.bgBlue.bold);
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST' , 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});

// Create a specific namespace for chat
const chatNamespace = io.of('/communication-service/socket');

// Initialize chat socket logic on this namespace
initializeChatSocket(chatNamespace);

// Log directory setup
const logDirectory = path.resolve(__dirname, './logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Set up log file rotation
const accessLogStream = createStream('access.log', {
  interval: '7d',
  path: logDirectory,
});

// Middleware setup
app.use(morgan('combined', { stream: accessLogStream }));
// app.use(morgan('tiny'));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST' , 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Use chat routes
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app. use('/api/notification', notificationRoutes);
app. use('/api/meeting', meetingRoutes);
