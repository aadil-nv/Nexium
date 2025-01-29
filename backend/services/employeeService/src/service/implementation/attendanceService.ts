import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import  IAttendanceService  from "../interface/IAttendanceService";
import { injectable, inject } from "inversify";
import { IAttendanceEntry } from "../../entities/attendanceEntities";
import { IApprovedLeaveDTO, IAttendanceResponceDTO } from "../../dto/IAttendanceDTO";
import { log } from "console";
import e from "express";
import { bgBlue } from "colors";


@injectable()
export default class AttendanceService implements IAttendanceService {
    constructor(@inject("IAttendanceRepository") private attendanceRepository: IAttendanceRepository) {
        this.attendanceRepository = attendanceRepository;
     }

     async updateAttendanceEntry(employeeId: string): Promise<IAttendanceResponceDTO> {
        try {    
            const updated =  await this.attendanceRepository.updateAttendances(employeeId);

            if(!updated){return{status: "error",message: "Attendance not updated"}}

            return{status: "success",message: "Attendance updated successfully"}
        } catch (error) {
            console.error(error);
            throw error;
            
        }
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
        try {
            let employeeAttendance = await this.attendanceRepository.findAttendanceByEmployeeId(employeeId) 
                || await this.attendanceRepository.createAttendanceRecord(employeeId);
    
            if (!employeeAttendance.attendance) employeeAttendance.attendance = [];
    
            if (!attendanceData?.date || !attendanceData?.checkInTime) {
                return { status: "error", message: "'date' and 'checkInTime' are required." };
            }
    
            const existingAttendance = employeeAttendance.attendance.find(
                (entry: IAttendanceEntry) => entry.date === attendanceData.date
            );
            if (existingAttendance) return { status: "error", message: "Attendance for this date is already marked" };
    
            const todaysCheckIn = {
                date: attendanceData.date,
                checkInTime: attendanceData.checkInTime,
                checkOutTime: null,
                minutes: 0,
                status: "Present"
            };
    
            const updatedAttendance = await this.attendanceRepository.markCheckIn(employeeAttendance._id, todaysCheckIn ,employeeId);
    
            return { status: "success", data: updatedAttendance, message: "Attendance marked successfully" };
        } catch (error) {
            console.error("Error adding attendance:", error);
            return { status: "error", message: "Internal server error" };
        }
    }
    
    async markCheckout(attendanceData: any, employeeId: string): Promise<IAttendanceResponceDTO> {
        try {
            const employeeAttendance = await this.attendanceRepository.findAttendanceByEmployeeId(employeeId);
            if (!employeeAttendance) {
                return { status: "error", message: "No attendance record found" };
            }
    
            const today = new Date().toISOString().split("T")[0];
            const todayAttendance = employeeAttendance.attendance.find(
                (entry: IAttendanceEntry) => entry.date === today && entry.status === "Present"
            );
            if (!todayAttendance) {
                return { status: "error", message: "No attendance record for today with 'Present' status" };
            }
    
            if (todayAttendance.checkOutTime) {
                return { status: "error", message: "Check-out time already marked" };
            }
    
            todayAttendance.checkOutTime = attendanceData.checkOutTime;
    
            const checkInDate = new Date(todayAttendance.checkInTime);
            const checkOutDate = new Date(attendanceData.checkOutTime);
    
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
                return { status: "error", message: "Invalid date format" };
            }
    
            // Calculate worked minutes
            const workedMinutes = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60));
            if (workedMinutes < 0) {
                return { status: "error", message: "Check-out time cannot be earlier than check-in time" };
            }
    
            // Store worked minutes in the 'hours' field
            todayAttendance.minutes = workedMinutes;
    
            // Determine work status thresholds (in minutes)
            const workTimeThreshold: { [key: string]: number } = {
                "Full-Time": 480, // 8 hours
                "Part-Time": 240, // 4 hours
                "Contract": 540, // 9 hours
                "Temporary": 420, // 7 hours
            };
    
            const workType = employeeAttendance.position as keyof typeof workTimeThreshold;
            const threshold = workTimeThreshold[workType] || 480;
    
            if (workedMinutes < threshold / 2) {
                todayAttendance.status = "Absent";
            } else if (workedMinutes < threshold) {
                todayAttendance.status = "Halfday";
            } else {
                todayAttendance.status = "Present";
            }
    
            const updatedAttendance = await this.attendanceRepository.markCheckOut(employeeAttendance._id, todayAttendance ,employeeId);
            if (!updatedAttendance) {
                return { status: "error", message: "Failed to update attendance record" };
            }
    
            return { status: "success", data: updatedAttendance, message: "Check-out marked successfully" };
        } catch (error) {
            console.error("Error marking checkout:", error);
            return { status: "error", message: "Internal server error" };
        }
    }
    
    async fetchApprovedLeaves(employeeId: string): Promise<IApprovedLeaveDTO> {
        try {
            const approvedLeaves= await this.attendanceRepository.fetchApprovedLeaves(employeeId)
            console.log("approvedLeaves--------------------------",approvedLeaves);
            

            if (!approvedLeaves) {
                throw new Error("No leave records found");
            }
            
            const leaveDTO: IApprovedLeaveDTO = {
         
              
                sickLeave: approvedLeaves.sickLeave,
                casualLeave: approvedLeaves.casualLeave,
                maternityLeave: approvedLeaves.maternityLeave,
                paternityLeave: approvedLeaves.paternityLeave,
                paidLeave: approvedLeaves.paidLeave,
                unpaidLeave: approvedLeaves.unpaidLeave,
                compensatoryLeave: approvedLeaves.compensatoryLeave,
                bereavementLeave: approvedLeaves.bereavementLeave,
                marriageLeave: approvedLeaves.marriageLeave,
                studyLeave: approvedLeaves.studyLeave,
             
              };
          
              return leaveDTO;
        } catch (error) {
            console.error("Error fetching approved leaves:", error);
            throw error;
        }
  
    }
    
    async applyLeave(data: any, employeeId: any): Promise<any> {
        console.log("Apply Leave Data:", data);
    
        try {
 
          const employeeData = await this.attendanceRepository.applyLeave(employeeId, data);
          if (!employeeData) {
            return { message: "Failed to apply leave", status: "error" };
          }
          return { message: "Leave applied successfully", status: "success" };
        } catch (error) {
          console.error("Error applying leave:", error);
          throw error;
        }
    }


        
    
}
