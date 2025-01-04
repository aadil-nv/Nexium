import { injectable, inject } from "inversify";
import IProjectService from "../interface/IProjectService";
import IProjectRepository from "../../repository/interface/IProjectRepository"; 
import { IProjectResponseDTO } from "dto/IProjectDTO";

@injectable()
export default class ProjectService implements IProjectService {
    constructor(@inject("IProjectRepository") private _projectRepository: IProjectRepository) {}

    async addNewProject(managerId:string ,data:any): Promise<IProjectResponseDTO> {
        try {
            // Fetch payroll criteria from the repository (this could be an array)
            const result  = await this._projectRepository.addNewProject(managerId , data);

            // If not found, throw an error
            if (!result) {
                throw new Error("Not addded new Proejct");
            }

              return {
                message:"dkjfshdkfh",
                success:false
              }

        } catch (error) {
            console.error("Error in ProjectService:", error);
            throw new Error("Error fetching payroll criteria");
        }
    }
 

}
