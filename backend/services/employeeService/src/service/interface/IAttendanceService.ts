export default interface IAttendanceService {
    fetchAttendances(employeeId: string): Promise<any>;
}