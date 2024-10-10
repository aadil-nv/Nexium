import { Router } from 'express';
import adminController from '../Controllers/adminController';

const adminRouter = Router();


adminRouter.post('/login', adminController.adminLogin); 


export default adminRouter; 