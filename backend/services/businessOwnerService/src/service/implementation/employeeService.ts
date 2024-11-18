import IEmployeeService from "../interface/IEmployeeService";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import { inject, injectable } from "inversify";

@injectable()   
export default class EmployeeService implements IEmployeeService {

  private _employeeRepository: IEmployeeRepository;

  constructor(@inject("IEmployeeRepository") employeeRepository: IEmployeeRepository) {
    this._employeeRepository = employeeRepository;
  }

  async getProfile(employeeId: string, companyId: string): Promise<void> {
    try {
      await this._employeeRepository.getProfile(employeeId, companyId);
    } catch (error) {
      throw new Error("Error adding attendance: " + error);
    }
  }
}
