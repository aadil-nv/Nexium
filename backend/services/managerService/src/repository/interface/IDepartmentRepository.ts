import IDepartment from "../../entities/departmentEntities";
import BaseRepository from "../../repository/implementation/baseRepository";

export default interface IDepartmentRepository extends BaseRepository<any> {
        addDepartments(departmentName: string, employees: any): Promise<any>;
        findDepartment(departmentId:string):Promise<any>
        updateDepartment(departmentId: string, updateData: any):Promise<any>
        deleteDepartment(departmentId: string): Promise<any>
        saveDepartment(department: any): Promise<any>
        findEmployee(employeeId: string): Promise<any>
        addEmployeesToDepartment(departmentId: string, employeeId: string): Promise<any>
        getDepartments():Promise<any>
        removeEmployeeFromDepartment(departmentId: string, employeeId: string): Promise<any>
        findAllDepartments(): Promise<IDepartment[]>
       
}