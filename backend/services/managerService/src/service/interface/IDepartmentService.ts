export default interface IDepartmentService {
    addDepartments(departmentName: string, employees: any ,businessOwnerId:string): Promise<any>;
    getDepartments(businessOwnerId:string):Promise<any>
    removeEmployee(employeeId:string , departmentId:string,businessOwnerId:string):Promise<any>
    deleteDepartment(departmentId: string ,businessOwnerId:string): Promise<any>
    updateDepartmentName(departmentId: string, newDepartmentName: string ,businessOwnerId:string): Promise<any>
    addEmployeesToDepartment(employeeData: any[] , departmentId: string,businessOwnerId:string ):Promise<any>
}