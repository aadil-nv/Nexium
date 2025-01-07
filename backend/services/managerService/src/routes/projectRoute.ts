import container from "../config/inversify";
import { Router } from "express";
import IProjectController from "../controllers/interface/IProjectController";
import authenticateToken from "../middlewares/tokenAuthenticate";
import { uploadMiddleware } from "../middlewares/uploadFile-s3";


const projectRouter = Router();

const projectController = container.get<IProjectController>("IProjectController");

projectRouter.get('/get-all-teamleads', authenticateToken,(req, res) => projectController.getAllTeamLeads(req, res))
projectRouter.get('/get-all-projects',authenticateToken,(req, res) => projectController.getAllProjects(req, res))

projectRouter.post('/add-new-project',authenticateToken,uploadMiddleware,(req, res) => projectController.addNewProject(req, res))
projectRouter.post('/update-project-file/:id',authenticateToken,uploadMiddleware,(req, res) => projectController.updateProjectFile(req, res))
projectRouter.delete('/delete-project/:id',authenticateToken,(req, res) => projectController.deleteProject(req, res))

projectRouter.put('/update-project/:id',authenticateToken,uploadMiddleware,(req, res) => projectController.updateProject(req, res))

export default projectRouter;