export default interface IDepartmentService {
    addDepartments(departmentName: string, employees: any): Promise<any>;
    getDepartments():Promise<any>
    removeEmployee(employeeId:string , departmentId:string):Promise<any>
    deleteDepartment(departmentId: string): Promise<any>
}