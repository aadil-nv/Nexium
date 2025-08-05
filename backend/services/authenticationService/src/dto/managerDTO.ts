import { IBusinessOwnerDocument } from "entities/businessOwnerEntities";

export  interface IValidateOtpDTO{
    success?:boolean;
    message?:string;
    accessToken?:string;
    refreshToken?:string;
    email?:string;
    managerName?:string;
    managerType?:string;
    managerProfilePicture?:string;
    companyLogo?:string;
    companyName?:string;
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

 export interface IGoogleResponseDTO {
    success?: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    managerName?:string;
    managerType?:string;
    profilePicture?:string;
    companyLogo?:string;
    companyName?:string;
    isVerified?:boolean
    businessOwnerData?:IBusinessOwnerDocument;
    isSubscribed?:boolean
 }