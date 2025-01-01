export const calculateDeductions = (grossSalary: number, basicSalary: number, deductions: any) => {
  // 1. Calculate income tax based on annual salary
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
  const pf = basicSalary * (deductions.providentFund / 100);

  // 3. Calculate Professional Tax based on the gross salary
  const professionalTax = grossSalary * (deductions.professionalTax / 100);

  // 4. Calculate ESI Fund based on the gross salary
  const esiFund = grossSalary * (deductions.esiFund / 100);

  // 5. Calculate other deductions (if any additional deductions are provided)
  const otherDeductions = grossSalary * (deductions.incomeTax / 100);  // Assuming other deductions are based on the incomeTax deduction

  // 6. Calculate the total deductions
  const totalDeductions = tax + pf + professionalTax + esiFund + otherDeductions;

  // 7. Calculate net salary
  const netSalary = grossSalary - totalDeductions;

  // Return deductions and final salary details
  return {
      tax,
      pf,
      professionalTax,
      esiFund,
      otherDeductions,
      totalDeductions,
      netSalary,
  };
};
