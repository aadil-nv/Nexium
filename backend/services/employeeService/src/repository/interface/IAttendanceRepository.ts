export default interface IAttendanceRepository {
    fetchAttendances(employeeId: string): Promise<any>
}