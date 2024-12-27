export interface IPayrollCriteriaDTO {
    _id: any;
    allowances: {
      bonus: number;
      gratuity: number;
      medicalAllowance: number;
      hra: number;
      da: number;
      ta: number;
      overTime: {
        type: number;
        overtimeEnabled: boolean;
      };
    };
    deductions: {
      incomeTax: number;
      providentFund: number;
      professionalTax: number;
      esiFund: number;
    };
    incentives: {
      _id?: any;
      incentiveName: string;
      minTaskCount: number;
      maxTaskCount: number;
      percentage: number;
    }[];
    payDay: number;
    createdAt: Date;
  }
  