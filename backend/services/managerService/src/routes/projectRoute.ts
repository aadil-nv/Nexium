import container from "../config/inversify";
import { Router } from "express";
import IProjectController from "../controllers/interface/IProjectController";
import authenticateToken from "../middlewares/tokenAuthenticate";


const projectRouter = Router();

const projectController = container.get<IProjectController>("IProjectController");

projectRouter.post('/add-new-project',authenticateToken,(req, res) => projectController.addNewProject(req, res))
// projectRouter.get('/get-all-prjects',authenticateToken,(req, res) => projectController.getAllPayrollCriteria(req, res))


export default projectRouter;