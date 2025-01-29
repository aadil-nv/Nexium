export default interface IOnboardingService {
    addOnboardingEmployee(employeeData: any ,managerId: string): Promise<any>;
}