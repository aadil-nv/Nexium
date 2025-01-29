export interface DepartmentWithEmployeesDTO {
    departmentId: string; // Unique identifier for the department
    departmentName: string; // Name of the department
    employees: {
      employeeId: string; // ID of the employee
      name: string; // Name of the employee
      email?: string; // Email of the employee (optional)
      position?: string; // Position of the employee (optional)
      profilePicture?: string; // Profile picture of the employee (optional)
      isActive: boolean; // Active status of the employee
    }[]; // Array of employees
  }
  