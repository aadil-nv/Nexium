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
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeChatSocket } from './config/chatSocket';

const app = express();
const PORT = 7006;

console.log(process.env.MONGODB_URL);


// HTTP Server to integrate Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize chat socket logic
initializeChatSocket(io);

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
});

app.use('/api/chat', chatRoutes);

httpServer.listen(PORT, () => {
  console.log(`chatService on http://localhost:${PORT}`.bgBlue.bold);
});
