import { Router, Request, Response } from 'express';
import AdminService from '../Services/adminService';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const newAdmin = await AdminService.registerAdmin(email, password);
        res.status(201).json(newAdmin);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const { token, admin } = await AdminService.login(email, password);
        res.status(200).json({ token, admin });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    }
});

export default router;
