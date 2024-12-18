export const calculateDeductions = (grossSalary: number, basicSalary: number) => {
    // Constants
    const PF_PERCENTAGE = 0.12;  // 12% for Provident Fund
  
    // 1. Calculate tax based on annual salary
    const annualSalary = grossSalary * 12;  // Assuming monthly salary
    let annualTax = 0;
  
    // Calculate tax based on slabs (using the new tax regime as an example)
    if (annualSalary <= 250000) {
      annualTax = 0;
    } else if (annualSalary <= 500000) {
      annualTax = (annualSalary - 250000) * 0.05;
    } else if (annualSalary <= 1000000) {
      annualTax = 250000 * 0.05 + (annualSalary - 500000) * 0.2;
    } else {
      annualTax = 250000 * 0.05 + 500000 * 0.2 + (annualSalary - 1000000) * 0.3;
    }
  
    const tax = annualTax / 12; // Monthly tax
  
    // 2. Calculate Provident Fund (PF) based on the basic salary
    const pf = grossSalary * PF_PERCENTAGE;
  
    // 3. Other deductions (e.g., insurance, loan repayments)
    const otherDeductions = grossSalary * 0.05;  // Assuming 5% for other deductions, you can customize
  
    // 4. Calculate the final salary after deductions
    const totalDeductions = tax + pf + otherDeductions;
    const netSalary = grossSalary - totalDeductions;
  
    // Return deductions and final salary details
    return {
      grossSalary,
      tax,
      pf,
      otherDeductions,
      totalDeductions,
      netSalary,
    };
  };
  
