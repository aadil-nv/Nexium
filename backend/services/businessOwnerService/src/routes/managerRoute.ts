import {Router} from 'express';
import container from '../config/inversify';
import IManagerController from '../controllers/interface/IManagerController';
import authenticateToken from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/multer-s3';

const managerRouter = Router();
const managerController = container.get<IManagerController>('IManagerController');

managerRouter.post('/add-managers', authenticateToken, (req, res, next) => managerController.addManagers(req, res));
managerRouter.get('/get-managers',authenticateToken, (req, res, next) => managerController.getAllManagers(req, res));
managerRouter.patch('/block-manager', authenticateToken, (req, res, next) => managerController.blockManager(req, res));
managerRouter.get('/get-manager/:id',authenticateToken, (req, res, next) => managerController.getManager(req, res));
managerRouter.put('/update-personal-info/:id',authenticateToken, (req, res, next) => managerController.updatePersonalInfo(req, res));
managerRouter.put('/update-professional-info/:id',authenticateToken, (req, res, next) => managerController.updateProfessionalInfo(req, res));
managerRouter.put('/update-address-info/:id',authenticateToken, (req, res, next) => managerController.updateAddressInfo(req, res));
managerRouter.patch('/update-profile-pic/:id',authenticateToken,uploadMiddleware, (req, res, next) => managerController.uploadProfilePic(req, res));
managerRouter.post('/update-resume/:id',authenticateToken,uploadMiddleware, (req, res, next) => managerController.updateResume(req, res));


export default managerRouter