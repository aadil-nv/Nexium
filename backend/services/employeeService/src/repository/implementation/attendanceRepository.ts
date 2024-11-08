import attendanceModel from "../../models/attendanceModel"; 
import IAttendanceRepository from "repository/interface/IAttendanceRepository";
import mongoose from "mongoose";
import { injectable } from "inversify";

@injectable()
export default class AttendanceRepository implements IAttendanceRepository {
    async fetchAttendances(employeeId : string): Promise<any> {
        try {
            const attendances = await attendanceModel
                .find({ userId: employeeId })
                .sort({ date: -1 })
                .exec();
            return attendances;
        } catch (error) {
            console.error(error);
            return { error: "Internal server error" };
        }
    }
}
