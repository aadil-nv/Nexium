import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';

// Ensure the log directory exists
const logDirectory = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Set up log file rotation
const accessLogStream = createStream('access.log', {
  interval: process.env.LOG_INTERVAL || '1d', // Default to daily rotation
  path: logDirectory,
});

// Export Morgan middleware
export default [
  morgan('combined', { stream: accessLogStream }),
  morgan('dev'),
];
