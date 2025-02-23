import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
import authenticateToken from "../middlewares/authMiddleware";
import {uploadMiddleware } from '../middlewares/multer-s3';
import checkSubscription from "../middlewares/checkSubscription";
const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")



businessOwnerRouter.get('/get-personaldetailes', authenticateToken, (req, res, next) => businessOwnerController.getPersonalDetails(req, res));
businessOwnerRouter.get('/get-companydetailes', authenticateToken, (req, res, next) => businessOwnerController.getCompanyDetails(req, res));
businessOwnerRouter.get('/get-address', authenticateToken, (req, res, next) => businessOwnerController.getAddress(req, res));
businessOwnerRouter.get('/get-documents', authenticateToken, (req, res, next) => businessOwnerController.getDocuments(req, res));

businessOwnerRouter.post('/update-isactive', authenticateToken, (req, res, next) => businessOwnerController.updateIsActive(req, res));
businessOwnerRouter.post('/upload-images', authenticateToken,uploadMiddleware,  (req, res, next) => businessOwnerController.uploadImages(req, res));
businessOwnerRouter.post('/upload-logo', authenticateToken,uploadMiddleware, (req, res, next) => businessOwnerController.uploadLogo(req, res));
businessOwnerRouter.post('/update-address', authenticateToken, (req, res, next) => businessOwnerController.updateAddress(req, res));
businessOwnerRouter.post('/upload-documents', authenticateToken,uploadMiddleware, (req, res, next) => businessOwnerController.uploadDocuments(req, res));
businessOwnerRouter.post('/refresh-token',(req, res, next) => businessOwnerController.setNewAccessToken(req, res));
businessOwnerRouter.post('/logout', (req, res, next) => businessOwnerController.logout(req, res));

businessOwnerRouter.patch('/update-personaldetailes', authenticateToken,uploadMiddleware, (req, res, next) => businessOwnerController.updatePersonalDetails(req, res));
businessOwnerRouter.patch('/update-companydetailes', authenticateToken, (req, res, next) => businessOwnerController.updateCompanyDetails(req, res));


businessOwnerRouter.post('/add-service-request', authenticateToken,checkSubscription("servicerequest"), (req, res, next) => businessOwnerController.addServiceRequest(req, res));
businessOwnerRouter.get('/service-requests', authenticateToken, (req, res, next) => businessOwnerController.getAllServiceRequests(req, res));
businessOwnerRouter.post('/updated-service-request/:id', authenticateToken, (req, res, next) => businessOwnerController.updateServiceRequest(req, res));

businessOwnerRouter.get('/get-all-leavetypes',authenticateToken,(req, res, next) => businessOwnerController.getAllLeaveTypes(req, res))
businessOwnerRouter.post("/update-leavetypes/:id", authenticateToken, (req, res, next) => businessOwnerController.updateLeaveTypes(req, res));

businessOwnerRouter.get('/get-all-payroll-crieteria',authenticateToken,(req, res ,next) => businessOwnerController.getAllPayrollCriteria(req, res))
businessOwnerRouter.post('/update-payroll-crieteria/:id', authenticateToken, (req, res, next) => businessOwnerController.updatePayrollCriteria(req, res));
businessOwnerRouter.patch('/delete-incentive/:id', authenticateToken,(req, res, next) => businessOwnerController.deleteIncentive(req, res))

export default businessOwnerRouter;