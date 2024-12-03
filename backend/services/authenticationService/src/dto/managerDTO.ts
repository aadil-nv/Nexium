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
    isVerified?:boolean
}

export interface IResponseDTO{
    success: boolean;
    message: string;
    data?: any;
  }