import { injectable, inject } from "inversify";
import IProjectService from "../interface/IProjectService";
import IProjectRepository from "../../repository/interface/IProjectRepository"; 
import { IProjectDTO, IProjectResponseDTO } from "../../dto/IProjectDTO";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import { IEmployeesDTO } from "../../dto/IEmployeesDTO";
import IEmployee from "../../entities/employeeEntities";
import {uploadMiddleware , uploadToS3 ,getSignedFileURL} from "../../middlewares/uploadFile-s3"

@injectable()
export default class ProjectService implements IProjectService {
    constructor(@inject("IProjectRepository") 
    private _projectRepository: IProjectRepository ,
    @inject("IEmployeeRepository") 
    private _employeeRepository: IEmployeeRepository) {}

    async addNewProject(managerId: string, data: any): Promise<IProjectResponseDTO | IProjectDTO> {
        try {
            if (!data.teamLeadId) {
                throw new Error("Team lead is required");
            }
            const teamLeadData = await this._employeeRepository.getEmployeeInformation(data.teamLeadId);
    
            if (!teamLeadData) {
                throw new Error("Team lead not found");
            }
    
            // Extract the employeeName from teamLeadData and assign it to assignedEmployee field
            const assignedEmployee = {
                employeeId: teamLeadData._id, // Assuming the teamLeadData has _id field
                employeeName: teamLeadData.personalDetails.employeeName, // Assuming employeeName is in personalDetails
            };
    
            if (data.projectFiles && Array.isArray(data.projectFiles)) {
                const uploadedFiles = await Promise.all(
                    data.projectFiles.map(async (file: any) => {
                        const fileBuffer = file.buffer; // Assuming `buffer` exists in file
                        const mimeType = file.type;
                        const fileName = await uploadToS3(fileBuffer, mimeType);
    
                        // Generate a signed URL for each uploaded file
                        const fileUrl = await getSignedFileURL(fileName);
    
                        return {
                            fileName: file.name,
                            fileUrl, // The signed URL
                            uploadedAt: new Date(),
                        };
                    })
                );
                data.projectFiles = uploadedFiles; // Replace local files with signed URLs
            } else {
                data.projectFiles = []; // Default to empty array if no files provided
            }
    
            // Pass the assignedEmployee to the repository layer
            const result = await this._projectRepository.addNewProject(managerId, data, assignedEmployee);
    
            if (!result) {
                throw new Error("Failed to add a new project");
            }
    
            // Create IProjectDTO from the saved project
            const projectDTO: IProjectDTO = {
                projectId: result._id,
                projectName: result.projectName,
                description: result.description,
                startDate: result.startDate,
                endDate: result.endDate,
                status: result.status,
                assignedEmployee: {
                    employeeId: result.assignedEmployee.employeeId,
                    employeeName: result.assignedEmployee.employeeName,
                    employeeFiles: result.assignedEmployee.employeeFiles,
                },
                projectFiles: result.projectFiles,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                managerStatus: result.managerStatus
            };
    
            return projectDTO;
        } catch (error) {
            console.error("Error in ProjectService:", error);
            throw new Error("Error while adding a new project");
        }
    }
    
    async getAllTeamLeads(): Promise<IEmployeesDTO[]> {
        try {
            // Fetch all team leads from the repository
            const employees = await this._employeeRepository.getAllTeamLeads()
          
            
    
            // Map the employee data to the DTO format
            const result: IEmployeesDTO[] = employees.map((employee: IEmployee) => ({
                employeeName: employee.personalDetails?.employeeName,
                position: employee.professionalDetails?.position,
                isActive: employee.isActive,
                profilePicture: employee.personalDetails?.profilePicture,
                employeeId: employee._id,
                email: employee.personalDetails?.email,
                isBlocked: employee.isBlocked,
            }));
    
            return result;
    
        } catch (error) {
            console.error("Error in ProjectService:", error);
            throw new Error("Error fetching team leads");
        }
    }

    async getAllProjects(): Promise<IProjectDTO[]> {
        try {
            const projects = await this._projectRepository.findAllProjects();
   
            const projectDTOs: IProjectDTO[] = projects.map((project) => {
                return {
                    projectId: project._id,
                    projectName: project.projectName,
                    description: project.description,
                    startDate: project.startDate,
                    endDate: project.endDate,
                    status: project.status,
                    assignedEmployee: {
                        employeeId: project.assignedEmployee.employeeId,
                        employeeName: project.assignedEmployee.employeeName,
                        employeeFiles: project.assignedEmployee.employeeFiles,
                    },
                    projectFiles: project.projectFiles,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt,
                    managerStatus: project.managerStatus
                };
            });
    
            return projectDTOs;
        } catch (error) {
            console.error("Error in ProjectService:", error);
            throw new Error("Error fetching projects");
        }
    }

    async updateProject(projectId: string, data: any): Promise<IProjectDTO> {
        console.log("data is from service is ===>".bgWhite.bold ,data);
        
        try {
            const updatedProject = await this._projectRepository.updateProject(projectId, data);
            if (!updatedProject) {
                throw new Error("Failed to update project");
            }
            const projectDTO: IProjectDTO = {
                projectId: updatedProject._id,
                projectName: updatedProject.projectName,
                description: updatedProject.description,
                startDate: updatedProject.startDate,
                endDate: updatedProject.endDate,
                status: updatedProject.status,
                assignedEmployee: {
                    employeeId: updatedProject.assignedEmployee.employeeId,
                    employeeName: updatedProject.assignedEmployee.employeeName,
                    employeeFiles: updatedProject.assignedEmployee.employeeFiles,
                },
                projectFiles: updatedProject.projectFiles,
                createdAt: updatedProject.createdAt,
                updatedAt: updatedProject.updatedAt,
                managerStatus: updatedProject.managerStatus

            };
            return projectDTO;
        } catch (error) {    
            console.error("Error in ProjectService:", error);
            throw new Error("Error updating project");
        }
    }
    

    async deleteProject(projectId: string): Promise<IProjectDTO> {
        try {
            const deletedProject = await this._projectRepository.deleteProject(projectId);
            if (!deletedProject) {
                throw new Error("Failed to delete project");
            }
            const projectDTO: IProjectDTO = {
                projectId: deletedProject._id,
                projectName: deletedProject.projectName,
                description: deletedProject.description,
                startDate: deletedProject.startDate,
                endDate: deletedProject.endDate,
                status: deletedProject.status,
                assignedEmployee: {
                    employeeId: deletedProject.assignedEmployee.employeeId,
                    employeeName: deletedProject.assignedEmployee.employeeName,
                    employeeFiles: deletedProject.assignedEmployee.employeeFiles,
                },
                projectFiles: deletedProject.projectFiles,
                createdAt: deletedProject.createdAt,
                updatedAt: deletedProject.updatedAt,
                managerStatus: deletedProject.managerStatus
            };
            return projectDTO;        
        } catch (error) {
            console.error("Error in ProjectService:", error);
            throw new Error("Error deleting project");
        }
    }

    async updateProjectFile(projectId: string, file: any): Promise<IProjectDTO> {
        try {
            const updatedProject = await this._projectRepository.updateProjectFile(projectId, file);
            if (!updatedProject) {
                throw new Error("Failed to update project file");
            }
            const projectDTO: IProjectDTO = {
                projectId: updatedProject._id,
                projectName: updatedProject.projectName,
                description: updatedProject.description,
                startDate: updatedProject.startDate,
                endDate: updatedProject.endDate,
                status: updatedProject.status,
                assignedEmployee: {
                    employeeId: updatedProject.assignedEmployee.employeeId,
                    employeeName: updatedProject.assignedEmployee.employeeName,
                    employeeFiles: updatedProject.assignedEmployee.employeeFiles,
                },
                projectFiles: updatedProject.projectFiles,
                createdAt: updatedProject.createdAt,
                updatedAt: updatedProject.updatedAt,
                managerStatus: updatedProject.managerStatus
            };            
            return projectDTO;
        } catch (error) {
            console.error("Error in ProjectService:", error);
            throw new Error("Error updating project file");
        }
            }
        
        }
    
 


