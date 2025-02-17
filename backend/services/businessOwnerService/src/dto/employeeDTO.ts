export interface IEmployeeDTO {
  _id: string
managerId: string; // Reference to HR as ObjectId in string format
businessOwnerId: string; // Reference to Business Owner as ObjectId in string format
isActive: boolean
isBlocked: boolean

personalDetails: {
employeeName: string;
email: string;
phone: string;
profilePicture:string
personalWebsite: string;
bankAccountNumber: string;
ifscCode: string;
aadharNumber: string;
panNumber: string;
gender: string;
};

address: {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

professionalDetails: {
  position: "Team Lead" | "Senior Software Engineer" | "Junior Software Engineer";
  workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
  department: string | null;
joiningDate: Date;
currentStatus: string;
salary: number;
uanNumber: string;
pfAccount: string;
esiAccount: string;
  
};

employeeCredentials: {
  companyEmail: string;
  companyPassword: string;
};


employeeLeaves: {
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
};

}
