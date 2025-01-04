export const calculateDeductions = (grossSalary: number, basicSalary: number, deductions: any) => {

    console.log("deductions from function ---------------", deductions);
    
    // 1. Calculate Provident Fund (PF) based on the basic salary
    const pf = grossSalary * (deductions.providentFund / 100);

    // 2. Calculate Professional Tax based on the gross salary
    const professionalTax = grossSalary * (deductions.professionalTax / 100);

    // 3. Calculate ESI Fund based on the gross salary
    const esiFund = grossSalary * (deductions.esiFund / 100);

    // 4. Calculate other deductions (if any additional deductions are provided)

    // 5. Calculate the total deductions
    const totalDeductions = pf + professionalTax + esiFund ;

    

    console.log("pf", pf, "professionalTax", professionalTax, "esiFund", esiFund, "totalDeductions", totalDeductions);

    return {
        pf,
        professionalTax,
        esiFund,
        totalDeductions,
    };
};
