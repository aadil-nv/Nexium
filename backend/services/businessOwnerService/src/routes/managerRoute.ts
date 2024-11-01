import {Router} from 'express';
import container from '../config/inversify';
import IManagerController from '../controllers/interface/IManagerController';

const managerRouter = Router();
const managerController = container.get<IManagerController>('IManagerController');

managerRouter.get('/get-profile', (req, res, next) => managerController.getProfile(req, res));

export default managerRouter