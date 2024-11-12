import {Router} from 'express';
import container from '../config/inversify';
import IManagerController from '../controllers/interface/IManagerController';
import authenticateToken from '../middlewares/authMiddleware';

const managerRouter = Router();
const managerController = container.get<IManagerController>('IManagerController');

managerRouter.get('/get-profile', (req, res, next) => managerController.getProfile(req, res));
managerRouter.get('/get-managers', (req, res, next) => managerController.getAllManagers(req, res));
managerRouter.post('/add-managers', authenticateToken, (req, res, next) => managerController.addManagers(req, res));

export default managerRouter