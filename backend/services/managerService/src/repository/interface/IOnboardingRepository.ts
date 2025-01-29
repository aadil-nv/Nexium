import  IEmployee  from "../../entities/employeeEntities";
import BaseRepository from "../../repository/implementation/baseRepository";

export  default interface IOnboardingRepository extends BaseRepository<IEmployee> {
    addOnboardingEmployee(employeeData: any, managerId: string): Promise<any>;
    getEmployeeByEmail(email: string): Promise<any>;
}