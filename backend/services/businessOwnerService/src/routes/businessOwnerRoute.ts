import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
import authenticateToken from "../middlewares/authMiddleware";
import {uploadMiddleware } from '../middlewares/multer-s3';
const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")





businessOwnerRouter.get('/get-personaldetailes', authenticateToken, (req, res, next) => businessOwnerController.getPersonalDetails(req, res));
businessOwnerRouter.get('/get-companydetailes', authenticateToken, (req, res, next) => businessOwnerController.getCompanyDetails(req, res));
businessOwnerRouter.get('/get-address', authenticateToken, (req, res, next) => businessOwnerController.getAddress(req, res));
businessOwnerRouter.get('/get-Documents', authenticateToken, (req, res, next) => businessOwnerController.getDocuments(req, res));


businessOwnerRouter.post('/upload-images', authenticateToken,uploadMiddleware,  (req, res, next) => businessOwnerController.uploadImages(req, res));
businessOwnerRouter.post('/upload-logo', authenticateToken,uploadMiddleware, (req, res, next) => businessOwnerController.uploadLogo(req, res));

businessOwnerRouter.patch('/update-personaldetailes', authenticateToken, (req, res, next) => businessOwnerController.updatePersonalDetails(req, res));


businessOwnerRouter.post('/refresh-token',(req, res, next) => businessOwnerController.setNewAccessToken(req, res));
businessOwnerRouter.post('/logout', (req, res, next) => businessOwnerController.logout(req, res));


export default businessOwnerRouter;