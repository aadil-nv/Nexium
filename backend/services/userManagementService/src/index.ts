import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './Config/connectDB';
// import adminRoutes from './Routes/adminRoutes';
// import companyRouter from './Routes/companyRoutes';
import 'colors' ;


dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 3000;
// connectDB(); 

// app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// app.use('/api/admin', adminRoutes); 
// app.use('/api/company', companyRouter); 

app.listen(PORT, () => {
  console.log(`adminManagement is running on http://localhost:${PORT}`.bgBlue.bold);
});
