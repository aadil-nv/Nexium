export  interface ILoginDTO{
    success?:boolean;
    message?:string;
    accessToken?:string;
    refreshToken?:string;
    email?:string;
    isVerified?:boolean
}

export  interface IValidateOtpDTO{
    success?:boolean;
    message?:string;
    accessToken?:string;
    refreshToken?:string;
    email?:string;
}