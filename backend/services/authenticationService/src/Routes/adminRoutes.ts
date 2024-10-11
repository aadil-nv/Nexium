import { Router, Request, Response } from 'express';
import AdminController from '../Controllers/adminController';

const router = Router();

// Define admin login route
router.post('/login', async (req: Request, res: Response) => {
    try {
        await AdminController.adminLogin(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Define admin register route
router.post('/register', async (req: Request, res: Response) => {
    try {
        await AdminController.adminRegister(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Define refresh token route
router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        await AdminController.refreshAccessToken(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Define logout route
router.post('/logout', async (req: Request, res: Response) => {
    try {
        await AdminController.logout(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
