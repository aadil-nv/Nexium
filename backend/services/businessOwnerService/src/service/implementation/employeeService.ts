import IEmployeeService from "../interface/IEmployeeService";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import { inject, injectable } from "inversify";


@injectable()   
export default class EmployeeService implements IEmployeeService {

    private employeeRepository: IEmployeeRepository;
    
    constructor(@inject("IEmployeeRepository")employeeRepository: IEmployeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async getProfile (employeeId: string, comapanyId: string): Promise<any>{
        try {
            await this.employeeRepository.getProfile(employeeId,comapanyId);
            return Promise.resolve();
        } catch (error) {
            console.error("Error adding attendance:", error);
            throw error;
        }
    }
}