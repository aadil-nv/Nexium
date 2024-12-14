export default interface IManagerProfileDTO {
   
    managerName?: string;
    personalWebsite?: string;
    email?: string;
    profilePicture?: string;
    phone?: string;
 
}

export interface IManaagerProfessionalInfoDTO {
    managerType?: "HumanResourceManager" | "GeneralManager" | "ProjectManager" | "SalesManager";
    workTime?: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
    joiningDate?: Date;
    designation?: string;
    salary?: number;
}

