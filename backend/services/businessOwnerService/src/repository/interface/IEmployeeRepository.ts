export default interface IEmployeeRepository {
    getProfile(employeeId: string, companyId: string): Promise<void>;
}