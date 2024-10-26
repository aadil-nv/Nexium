import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Config/connectDB';
import superAdminRoutes from './Routes/superAdminRoute';
import businessOwnerRoutes from './Routes/businessOwnerRoute';
// import companyRouter from './Routes/companyRoutes';
import 'colors' ;


dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 3000;
connectDB(); 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/super-admin', superAdminRoutes); 
app.use('/api/business-owner', businessOwnerRoutes); 


app.listen(PORT, () => {
  console.log(`userManagementService on http://localhost:${PORT}`.bgBlue.bold);
});
