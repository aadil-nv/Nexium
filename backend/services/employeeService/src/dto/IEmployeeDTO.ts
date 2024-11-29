export interface ISetNewAccessTokenDTO {
        accessToken: string;
        message: string;
        success: boolean
        businessOwnerId:string
    }

export interface IGetProfileDTO {
    employeeName: string;
    email: string;
    phone: string;
    profilePicture:string;
    message: string;
 
}    
