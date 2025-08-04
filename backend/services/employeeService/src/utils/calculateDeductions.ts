export const calculateDeductions = (grossSalary: number, basicSalary: number, deductions: any) => {
    const pf = grossSalary * (deductions.providentFund / 100);
    const professionalTax = grossSalary * (deductions.professionalTax / 100);
    const esiFund = grossSalary * (deductions.esiFund / 100);
    const totalDeductions = pf + professionalTax + esiFund ;

    return {
        pf,
        professionalTax,
        esiFund,
        totalDeductions,
    };
};
