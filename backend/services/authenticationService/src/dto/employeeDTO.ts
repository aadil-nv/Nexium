export interface IEmoloyeeLoginDTO {
    email?: string;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    success?: boolean
    employeeName?:string;
    employeeType?:string;
    employeerProfilePicture?:string;
    companyLogo?:string;
    companyName?:string;
}

export  interface IValidateOtpDTO{
    success?:boolean;
    message?:string;
    accessToken?:string;
    refreshToken?:string;
    email?:string;
    workTime?:string;
    position?:string;
}

