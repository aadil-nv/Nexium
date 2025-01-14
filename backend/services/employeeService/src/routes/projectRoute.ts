import container from "../config/inversify";
import { Router } from "express";
import tokenAutharaise from "../middlewares/tokenAuth";
import IProjectController from "../controllers/interface/IProjectController";
import { uploadMiddleware } from "../middlewares/multer-s3";

const projectRouter = Router();

const projectController = container.get<IProjectController>("IProjectController");

projectRouter.get("/get-all-projects",tokenAutharaise,(req, res)=> projectController.getAllProjects(req, res));
projectRouter.patch('/update-project-status/:id',tokenAutharaise,(req, res)=> projectController.updateProjectStatus(req, res));
projectRouter.post('/update-employeefiles/:id',tokenAutharaise,uploadMiddleware,(req, res)=> projectController.updateEmployeeFiles(req, res));


export default projectRouter