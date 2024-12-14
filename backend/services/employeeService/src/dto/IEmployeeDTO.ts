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
    personalWebsite: string;
 
}    

export interface IEmployeeResponseDTO {
    success?: boolean;
    message?: string;
    data?: any;
  }

export interface IGetAddressDTO{
    street: String ,
    city:  String ,
    state:  String ,
    country:  String ,
    postalCode:  String ,
}  

export interface IGetEmployeeProfessionalDTO {
    position: string ;
    department: string;
    workTime: string;
    joiningDate: Date;
    currentStatus: string;
    companyName: string;
    salary: number;
   

}


export interface IGetDocumentDTO{
    documentName: string;       
    documentUrl: string;       
    documentSize: string;     
    uploadedAt: Date;  
}

export interface IGetCredentailsDTO{
    companyEmail: string;
    companyPassword: string
}

