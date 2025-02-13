import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { initializeChatSocket } from './config/chatSocket';
import chatRoutes from './routes/chatRoute';
import messageRoutes from './routes/messageRoute';
import notificationRoutes from './routes/notificationRoute';
import meetingRoutes from './routes/meetingRoute';
import 'colors';
import logger from './utils/logger'; // Import logger

const app = express();
const PORT = process.env.PORT;

// Middleware setup
app.use(logger);
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/meeting', meetingRoutes);

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`communication-service is running on http://localhost:${PORT}`.bgBlue.bold);
});

// Set up WebSocket server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});

// Create a specific namespace for chat
const chatNamespace = io.of('/socket');
initializeChatSocket(chatNamespace);
