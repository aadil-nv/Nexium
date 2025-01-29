export function generatePassword(companyName: string, employeeName: string, managerId: string): string {
    // Remove spaces from input values and ensure proper casing
    const sanitizedEmployeeName = employeeName.replace(/\s+/g, '').charAt(0).toUpperCase() + employeeName.slice(1).toLowerCase();
    const sanitizedCompanyName = companyName.replace(/\s+/g, '').toLowerCase();
    const sanitizedManagerId = managerId.replace(/\s+/g, '').slice(0, 4); // Using the first 4 digits of managerId
  
    // Generate password in the format "Aadil.puma@3845"
    const password = `${sanitizedEmployeeName}.${sanitizedCompanyName}@${sanitizedManagerId}`;
  
    return password;
  }