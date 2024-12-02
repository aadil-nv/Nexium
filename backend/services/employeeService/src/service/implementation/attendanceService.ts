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
        console.log("calling marck checkout ============================");
        console.log(`"calling marck checkout ============================"`.bgRed, attendanceData);
    
        try {
            // Find the attendance record for the employee
            let employeeAttendance = await this.attendanceRepository.findAttendanceByEmployeeId(employeeId);
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    
            if (!employeeAttendance) {
                return {
                    status: "error",
                    data: null,
                    message: "No attendance record found for this employee",
                };
            }
            console.log("Employee attendance is --->", employeeAttendance);
    
            const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    
            // Ensure there's a matching attendance entry for today and status is Present
            const todayAttendance = employeeAttendance.attendance.find(
                (entry: IAttendanceEntry) => entry.date === today && entry.status === "Present"
            );
    
            if (!todayAttendance) {
                return {
                    status: "error",
                    data: null,
                    message: "No attendance record for today with 'Present' status",
                };
            }
    
            console.log("Employee attendance for today --->", todayAttendance);
    
            // Ensure the employee's current status is 'checkIn' before proceeding
            if (todayAttendance.status !== "Present") {
                return {
                    status: "error",
                    data: null,
                    message: "Check-out can only be marked after check-in",
                };
            }
    
            console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
    
            // If checkOutTime is empty or undefined, add the checkOutTime and calculate hours
            if (!todayAttendance.checkOutTime) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                // Set the checkout time
                todayAttendance.checkOutTime = attendanceData.checkOutTime;
    
                // Validate checkInTime and checkOutTime as valid ISO 8601 strings
                const checkInDate = new Date(todayAttendance.checkInTime);
                const checkOutDate = new Date(attendanceData.checkOutTime);
    
                if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
                    return {
                        status: "error",
                        data: null,
                        message: "Invalid date format for check-in or check-out time",
                    };
                }
    
                // Calculate the worked hours by subtracting checkInTime from checkOutTime
                const workedHours = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
    
                // Ensure the worked hours is non-negative (in case checkOutTime is earlier than checkInTime)
                if (workedHours < 0) {
                    return {
                        status: "error",
                        data: null,
                        message: "Check-out time cannot be earlier than check-in time",
                    };
                }
    
                todayAttendance.hours = workedHours;
    
                // Get the employee's work type and calculate work time thresholds
                const workType = employeeAttendance.position; // assuming position indicates work type (Full-Time, Part-Time, etc.)
                let workTimeThreshold: number;
                console.log("1111111111111111111111111111111111111");
    
                switch (workType) {
                    case "Full-Time":
                        workTimeThreshold = 8; // Full-time is 8 hours
                        break;
                    case "Part-Time":
                        workTimeThreshold = 4; // Part-time is 4 hours
                        break;
                    case "Contract":
                        workTimeThreshold = 9; // Contract is 9 hours
                        break;
                    case "Temporary":
                        workTimeThreshold = 7; // Temporary is 7 hours
                        break;
                    default:
                        workTimeThreshold = 8; // Default to Full-Time if no specific type is found
                }
    
                // Update status based on worked hours relative to work type
                if (workedHours < workTimeThreshold / 2) {
                    todayAttendance.status = "Absent"; // Less than half of the required hours
                } else if (workedHours >= workTimeThreshold / 2 && workedHours < workTimeThreshold) {
                    todayAttendance.status = "Halfday"; // More than half but less than full
                } else {
                    todayAttendance.status = "Present"; // Full or more than required hours
                }
    
                // Update currentStatus to 'marked' after successful check-out
                todayAttendance.isCompleted = true;
                console.log("2222222222222222222222222222222222222");
            } else {
                return {
                    status: "error",
                    data: null,
                    message: "Check-out time has already been marked for this date",
                };
            }
    
            // Save the updated attendance record
            console.log("3333333333333333333333333333333333333");
            const updatedAttendance = await this.attendanceRepository.updateAttendance(
                employeeAttendance._id,
                { attendance: employeeAttendance.attendance }
            );
    
            console.log("4444444444444444444444444444444444444");
    
            if (!updatedAttendance) {
                return {
                    status: "error",
                    data: null,
                    message: "Failed to update attendance record",
                };
            }
            console.log("5555555555555555555555555555555555555");
    
            return {
                status: "success",
                data: updatedAttendance,
                message: "Check-out marked successfully",
            };
        } catch (error) {
            console.error("Error marking checkout:", error);
            return {
                status: "error",
                data: null,
                message: "Internal server error",
            };
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
            // Fetch all attendance records for the employee
            const attendanceData = await this.attendanceRepository.fetchAttendances(employeeId);
            
            console.log(`attendanceData is >>>>>>`, JSON.stringify(attendanceData, null, 2));
    
            // Check if attendanceData is valid and contains the correct object structure
            if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
                console.log('Attendance data is missing or empty');
                return { message: "No attendance data found for the employee", status: "error" };
            }
    
            // Assuming you need to find the attendance for a specific employeeId
            const employeeAttendance = attendanceData.find((record: any) => record.employeeId.toString() === employeeId.toString());
    
            if (!employeeAttendance || !Array.isArray(employeeAttendance.attendance)) {
                console.log('Employee attendance data is missing or not in the correct format');
                return { message: "No attendance data found for this employee", status: "error" };
            }
    
            // Find the specific attendance entry by attendanceId
            const selectedDayAttendance = employeeAttendance.attendance.find((attendance: any) =>
                attendance._id.toString() === data.attendanceId
            );
    
            if (selectedDayAttendance) {
                // Update the selected attendance record
                selectedDayAttendance.leaveType = data.leaveType || null;
                selectedDayAttendance.reason = data.reason || null;
                selectedDayAttendance.leaveStatus = "Pending";
    
                // Save the updated attendance data
                await employeeAttendance.save();
    
                return { message: "Leave applied successfully", status: "success" };
            } else {
                // If no record found for the attendanceId, handle the error
                return { message: "No attendance record found for the given ID", status: "error" };
            }
        } catch (error) {
            console.error("Error applying leave:", error);
            throw error;
        }
    }
    
    
    
    
    
    
    
    
}
