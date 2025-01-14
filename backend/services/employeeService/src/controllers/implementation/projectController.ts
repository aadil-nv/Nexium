import { inject ,injectable } from "inversify";
import { Request, Response } from "express";
import IProjectService from "../../service/interface/IProjectService";
import IProjectController from "../../controllers/interface/IProjectController";
import { HttpStatusCode } from "../../utils/enums";
import { CustomRequest } from "../../middlewares/tokenAuth";


@injectable()
export default class ProjectController implements IProjectController{
    constructor(@inject("IProjectService") private _projectService: IProjectService){}

    async getAllProjects(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const employeeId = req.user?.employeeData?._id;
            
            const projects = await this._projectService.getAllProjects(employeeId as string);

            return res.status(HttpStatusCode.OK).json(projects);
        } catch (error) {

            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateProjectStatus(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const projectId = req.params.id;
            
            const status = req.body.status;
            
            const updatedProject = await this._projectService.updateProjectStatus(projectId, status);
            
            return res.status(HttpStatusCode.OK).json(updatedProject);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateEmployeeFiles(req: CustomRequest, res: Response): Promise<Response> {
        console.log("update employee files ====================================>");
        
        try {
            const projectId = req.params.id
            console.log("project id is ==>",projectId);
            
            const projectFiles = req.file;
            console.log("project files is ==>",projectFiles)
            
            
            const updatedProject = await this._projectService.updateEmployeeFiles(projectId as string, projectFiles);
            console.log("updated project is ==>",updatedProject);
            
            return res.status(HttpStatusCode.OK).json(updatedProject);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}