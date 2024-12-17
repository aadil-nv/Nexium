export interface IEmployee {
    _id?: string;              
    name?: string;    
    email?: string;        
    position?: string;      
    profilePicture?: string;   
    isActive?: boolean;  
  }
  
  export interface IGetDepartmentDTO {
    departmentId?: string;        
    departmentName?: string;     
    employees?: IEmployee[];   
    success?: boolean;
    message?: string;
        
  }
  