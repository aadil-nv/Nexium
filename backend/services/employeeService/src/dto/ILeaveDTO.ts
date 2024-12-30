export interface ILeaveDTO {
    leaveId?: any;
    employeeId?: string;
    leaveType?: string;
    reason?: string;
    startDate?: Date;
    endDate?: Date;
    duration?: number;
    message?: string;
    success?: boolean;
}