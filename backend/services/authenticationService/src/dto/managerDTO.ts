export  interface IValidateOtpDTO{
    success?:boolean;
    message?:string;
    accessToken?:string;
    refreshToken?:string;
    email?:string;
}

export  interface ILoginDTO{
    success?:boolean;
    message?:string;
    accessToken?:string;
    refreshToken?:string;
    email?:string;
    isVerified?:boolean;
    managerName?:string;
    managerType?:string;
    managerProfilePicture?:string;
    companyLogo?:string;
    companyName?:string;
}

export interface IResponseDTO{
    success: boolean;
    message: string;
    data?: any;
  }