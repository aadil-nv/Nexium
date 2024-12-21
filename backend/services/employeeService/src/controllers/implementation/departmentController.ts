import {inject,injectable} from "inversify";
import {Request,Response} from "express";
import IDepartmentService from "../../service/interface/IDepartmentService";
import { HttpStatusCode } from "../../utils/enums";
import { CustomRequest } from "../../middlewares/tokenAuth";
import IDepartmentController  from "../../controllers/interface/IDepartmentController";

@injectable()
export default class DepartmentController implements IDepartmentController {

    constructor(@inject("IDepartmentService") private _departmentService: IDepartmentService) { }

    async getDepartment(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitting get department ===============**********==================");
        
        try {
            const employeeId = req.user?.employeeData?._id;
            console.log("employeeId from controller--------------",employeeId);
            
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const department = await this._departmentService.getDepartment(employeeId);
            console.log(`department from controller `.bgCyan,department);
            
            return res.status(HttpStatusCode.OK).json(department);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}