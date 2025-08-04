export function generateEmail(companyName: string, employeeName: string, managerId: string): string {
    const sanitizedEmployeeName = employeeName.replace(/\s+/g, '').toLowerCase();
    const sanitizedCompanyName = companyName.replace(/\s+/g, '').toLowerCase();
    const sanitizedManagerId = managerId.replace(/\s+/g, '').toLowerCase();
  
    const email = `${sanitizedEmployeeName}.${sanitizedCompanyName}${sanitizedManagerId.slice(0, 8)}@gmail.com`;
  
    return email;
  }