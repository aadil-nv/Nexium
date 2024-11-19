export default interface IDepartmentService {
    addDepartments(departmentName: string, employees: any): Promise<any>;
    getDepartments():Promise<any>
    removeEmployee(employeeId:string , departmentId:string):Promise<any>
    deleteDepartment(departmentId: string): Promise<any>
    updateDepartmentName(departmentId: string, newDepartmentName: string): Promise<any>
    addEmployeeToDepartment(employeeId: string, departmentId: string):Promise<any>
}