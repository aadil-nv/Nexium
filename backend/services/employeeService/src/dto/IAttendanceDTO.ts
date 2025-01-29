export interface IAttendanceResponceDTO {
    status?: string;
    message?: string;
    data?: any;
}

export interface IApprovedLeaveDTO {
    sickLeave: number;
    casualLeave: number;
    maternityLeave: number;
    paternityLeave: number;
    paidLeave: number;
    unpaidLeave: number;
    compensatoryLeave: number;
    bereavementLeave: number;
    marriageLeave: number;
    studyLeave: number;
    
}