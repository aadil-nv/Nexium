export default interface IEmployeeService { 
    getProfile(employeeId: string, companyId: string): Promise<any>;
}