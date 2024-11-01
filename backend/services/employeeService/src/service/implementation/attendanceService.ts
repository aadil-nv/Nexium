import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import  IAttendanceService  from "../interface/IAttendanceService";
import { injectable, inject } from "inversify";
import e from "express";


@injectable()
export default class AttendanceService implements IAttendanceService {
    constructor(@inject("IAttendanceRepository") private attendanceRepository: IAttendanceRepository) {
        this.attendanceRepository = attendanceRepository;
     }
    async fetchAttendances(employeeId: string): Promise<any> {
        try {
            const attendances = await this.attendanceRepository.fetchAttendances(employeeId);
            return attendances
        } catch (error) {
            console.error(error);
            return { error: "Internal server error" };
            
        }
    }
}
