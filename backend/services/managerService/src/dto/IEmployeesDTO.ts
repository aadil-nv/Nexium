export interface IEmployeesDTO {
    employeeName: string;
    position: string;
    isActive: boolean;
    profilePicture: string;
    _id: string
    email: string
}

export interface IEmployeePersonalInformationDTO {
    employeeName: string;
    email: string;
    phone: string;
    profilePicture:string
}

export interface IEmployeeAddressDTO {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}