import IDepartment from "../../entities/departmentEntities";
import BaseRepository from "../../repository/implementation/baseRepository";

export default interface IDepartmentRepository extends BaseRepository<any> {
        addDepartments(departmentName: string, employees: any,businessOwnerId:string): Promise<any>;
        findDepartment(departmentId:string ,businessOwnerId:string):Promise<any>
        updateDepartment(departmentId: string, updateData: any,businessOwnerId:string):Promise<any>
        deleteDepartment(departmentId: string,businessOwnerId:string): Promise<any>
        saveDepartment(department: any,businessOwnerId:string): Promise<any>
        findEmployee(employeeId: string,businessOwnerId:string): Promise<any>
        addEmployeesToDepartment(departmentId: string, employeeId: string,businessOwnerId:string): Promise<any>
        getDepartments(businessOwnerId:string):Promise<any>
        removeEmployeeFromDepartment(departmentId: string, employeeId: string,businessOwnerId:string): Promise<any>
        findAllDepartments(businessOwnerId:string): Promise<IDepartment[]>
       
}