import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
import connectDB from './config/connectDB';
// import superAdminRoutes from './routes/superAdminRoute';
// import businessOwnerRoutes from './routes/businessOwnerRoute';
// import managerRoutes from './routes/managerRoute';
// import employeeRoutes from './routes/employeeRoute';
import 'colors' ;



const app = express(); 
const PORT = process.env.PORT || 3000;
// connectDB(); 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// app.use('/api/super-admin', superAdminRoutes); 
// app.use('/api/business-owner', businessOwnerRoutes); 
// app.use('/api/manager', managerRoutes); 
// app.use('/api/employee', employeeRoutes);


app.listen(PORT, () => {
  console.log(`managerService on http://localhost:${PORT}`.bgMagenta.bold);
});
