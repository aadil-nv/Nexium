import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import  IAttendanceService  from "../interface/IAttendanceService";
import { injectable, inject } from "inversify";
import { IAttendanceEntry } from "../../entities/attendanceEntities";
import { IAttendanceResponceDTO } from "../../dto/IAttendanceDTO";
import { log } from "console";
import e from "express";
import { bgBlue } from "colors";


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

    async markCheckin(attendanceData: any, employeeId: string): Promise<IAttendanceResponceDTO> {
        console.log("Hitting attendance service=========================>>>>>>", attendanceData);
    
        try {
            // Find the attendance record for the employee
            let employeeAttendance = await this.attendanceRepository.findAttendanceByEmployeeId(employeeId);
            console.log("Employee Attendance Record:", employeeAttendance);
    
            if (!employeeAttendance) {
                // Create a new attendance record if none exists
                console.log("No attendance record found. Creating a new record...");
                employeeAttendance = await this.attendanceRepository.createAttendanceRecord(employeeId);
            }
    
            // Ensure attendance array exists
            if (!employeeAttendance.attendance) {
                employeeAttendance.attendance = []; // Create an empty array if not present
            }
    
            // Log attendance before pushing
            console.log("Before Adding New Attendance", employeeAttendance.attendance);
    
            // Validate that the attendance data is correctly structured
            if (!attendanceData || !attendanceData.date || !attendanceData.checkInTime) {
                return {
                    status: "error",
                    data: null,
                    message: "Invalid attendance data provided. 'date' and 'checkInTime' are required.",
                };
            }
    
            // Check if the attendance for the given date already exists
            const existingAttendance = employeeAttendance.attendance.find(
                (entry: IAttendanceEntry) => entry.date === attendanceData.date
            );
            console.log("Existing Attendance:", existingAttendance);
    
            if (existingAttendance) {
                return {
                    status: "error",
                    data: null,
                    message: "Attendance for this date is already marked",
                };
            }
    
            // Add the new attendance entry to the attendance array
            employeeAttendance.attendance.push({
                date: attendanceData.date,
                checkInTime: attendanceData.checkInTime,
                checkOutTime: null,
                hours: 0,
                status: "Present",
                leaveStatus: null
            });
    
    
    
            // Log attendance after pushing
            console.log("After Adding New Attendance", employeeAttendance.attendance);
    
            // Save the updated attendance record
            const updatedAttendance = await this.attendanceRepository.updateAttendance(
                employeeAttendance._id,
                { 
                    attendance: employeeAttendance.attendance,
                 
                }
            );
    
            // Log the update result
            console.log("Updated Attendance", updatedAttendance);
    
            if (!updatedAttendance) {
                return {
                    status: "error",
                    data: null,
                    message: "Failed to update attendance record",
                };
            }
    
            return {
                status: "success",
                data: updatedAttendance,
                message: "Attendance marked successfully",
            };
        } catch (error) {
            console.error("Error adding attendance:", error);
            return {
                status: "error",
                data: null,
                message: "Internal server error",
            };
        }
    }
    
    async markCheckout(attendanceData: any, employeeId: string): Promise<IAttendanceResponceDTO> {
        try {
            const employeeAttendance = await this.attendanceRepository.findAttendanceByEmployeeId(employeeId);
            if (!employeeAttendance) return { status: "error", message: "No attendance record found" };
    
            const today = new Date().toISOString().split("T")[0];
            const todayAttendance = employeeAttendance.attendance.find((entry: IAttendanceEntry) => entry.date === today && entry.status === "Present");
            if (!todayAttendance) return { status: "error", message: "No attendance record for today with 'Present' status" };
    
            if (todayAttendance.checkOutTime) return { status: "error", message: "Check-out time already marked" };
    
            todayAttendance.checkOutTime = attendanceData.checkOutTime;
    
            const checkInDate = new Date(todayAttendance.checkInTime);
            const checkOutDate = new Date(attendanceData.checkOutTime);
    
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return { status: "error", message: "Invalid date format" };
    
            const workedHours = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
            if (workedHours < 0) return { status: "error", message: "Check-out time cannot be earlier than check-in time" };
    
            todayAttendance.hours = workedHours;
    
            const workTimeThreshold: { [key: string]: number } = {
                "Full-Time": 8,
                "Part-Time": 4,
                "Contract": 9,
                "Temporary": 7
            };
    
            const workType = employeeAttendance.position as keyof typeof workTimeThreshold;
            const threshold = workTimeThreshold[workType] || 8;
    
            if (workedHours < threshold / 2) todayAttendance.status = "Absent";
            else if (workedHours < threshold) todayAttendance.status = "Halfday";
            else todayAttendance.status = "Present";
    
            todayAttendance.isCompleted = true;
    
            const updatedAttendance = await this.attendanceRepository.updateAttendance(employeeAttendance._id, { attendance: employeeAttendance.attendance });
            if (!updatedAttendance) return { status: "error", message: "Failed to update attendance record" };
    
            return { status: "success", data: updatedAttendance, message: "Check-out marked successfully" };
        } catch (error) {
            console.error("Error marking checkout:", error);
            return { status: "error", message: "Internal server error" };
        }
    }
    
    
    
    
    async fetchApprovedLeaves(employeeId: string): Promise<any> {
        try {
            const employeeData= await this.attendanceRepository.findEmployeeById(employeeId);

            console.log("Employee Data:", employeeData);    
            
            if (!employeeData) {
                return {
                    status: "error",
                    data: null,
                    message: "Employee not found",
                };
            }
            
            const leaves = employeeData.leaves

            console.log("Leaves:", leaves);
            
            

            return leaves;
        } catch (error) {
            console.error("Error fetching approved leaves:", error);
            throw error;
        }
    }
    
    
    async applyLeave(data: any, employeeId: any): Promise<any> {
        try {
            const attendanceData = await this.attendanceRepository.fetchAttendances(employeeId);
            
            if (!attendanceData?.length) return { message: "No attendance data found", status: "error" };
    
            const employeeAttendance = attendanceData.find((record: any) => record.employeeId.toString() === employeeId.toString());
            if (!employeeAttendance?.attendance?.length) return { message: "No attendance data for this employee", status: "error" };
    
            const selectedDayAttendance = employeeAttendance.attendance.find((attendance: any) => attendance._id.toString() === data.attendanceId);
            if (!selectedDayAttendance) return { message: "No attendance record found for the given ID", status: "error" };
    
            selectedDayAttendance.leaveType = data.leaveType || null;
            selectedDayAttendance.reason = data.reason || null;
            selectedDayAttendance.leaveStatus = "Pending";
    
            await employeeAttendance.save();
            return { message: "Leave applied successfully", status: "success" };
        } catch (error) {
            console.error("Error applying leave:", error);
            throw error;
        }
    }
    
}
