import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors here
import connectDB from './Config/connectDB';
import adminRoutes from './Routes/adminRoutes';

dotenv.config(); // Load environment variables

const app = express(); // Declare app here
const PORT = process.env.PORT || 3000;
connectDB(); // Connect to the database

app.use(cors()); // Use CORS middleware
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// You can define your admin routes here
app.use('/api/admin', adminRoutes); // Use the admin routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
