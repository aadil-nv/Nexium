import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
import connectDB from './config/connectDB';
<<<<<<< HEAD
=======

>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
import businessOwnerRoutes from './routes/businessOwnerRoute';
import managerRoutes from './routes/managerRoute';
import employeeRoutes from './routes/employeeRoute';
import 'colors' ;
import {connectConsumer} from "./events/rabbitmq/connectConsumer"



const app = express(); 
const PORT = process.env.PORT || 3000;
connectDB(); 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use('/api/business-owner', businessOwnerRoutes); 
app.use('/api/manager', managerRoutes); 
app.use('/api/employee', employeeRoutes);

connectConsumer();

app.listen(PORT, () => {
  console.log(`businessOwnerService on http://localhost:${PORT}`.bgBlue.bold);
});
