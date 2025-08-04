interface IncentiveSlab {
    incentiveName: string;
    minTaskCount: number;
    maxTaskCount: number;
    percentage: number;
  }
  
export   const calculateIncentive = (incentives: IncentiveSlab[], completedTaskCount: number, basicSalary: number): number => {
    let incentiveAmount = 0;
  
    for (let i = 0; i < incentives.length; i++) {
      const slab = incentives[i];
  
      if (completedTaskCount >= slab.minTaskCount && completedTaskCount <= slab.maxTaskCount) {
        incentiveAmount = basicSalary * slab.percentage / 100;
        break; 
      } else {
        console.log("Task count does not fall within this slab's range.");
      }
    }
  
    if (incentiveAmount === 0) {
      console.log("No matching slab found. Returning incentive amount: ₹0");
    }
  
    return incentiveAmount;
  };
  