import express, { Request, Response } from 'express';
import { CompanyController } from '../Controllers/companyController';

const companyRouter = express.Router();
const companyController = new CompanyController();

// Using async function to handle promises properly
companyRouter.post('/login', async (req: Request, res: Response) => {
    await companyController.login(req, res);
});

companyRouter.post('/register', async (req: Request, res: Response) => {
    await companyController.register(req, res);
});

export default companyRouter;
