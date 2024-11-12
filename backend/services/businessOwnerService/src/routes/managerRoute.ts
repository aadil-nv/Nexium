import {Router} from 'express';
import container from '../config/inversify';
import IManagerController from '../controllers/interface/IManagerController';
import authenticateToken from '../middlewares/authMiddleware';

const managerRouter = Router();
const managerController = container.get<IManagerController>('IManagerController');

managerRouter.post('/add-managers', authenticateToken, (req, res, next) => managerController.addManagers(req, res));
managerRouter.get('/get-managers',authenticateToken, (req, res, next) => managerController.getAllManagers(req, res));


export default managerRouter