interface IncentiveSlab {
    incentiveName: string;
    minTaskCount: number;
    maxTaskCount: number;
    percentage: number;
  }
  
export   const calculateIncentive = (incentives: IncentiveSlab[], completedTaskCount: number, basicSalary: number): number => {
    let incentiveAmount = 0;
  
    console.log("Incentive Slabs:", incentives);
    console.log("Completed Task Count:", completedTaskCount);
    console.log("Basic Salary:", basicSalary);
  
    // Iterate through the incentive slabs
    for (let i = 0; i < incentives.length; i++) {
      const slab = incentives[i];
  
      console.log(`Checking slab ${slab.incentiveName}:`);
      console.log(`Min Task Count: ${slab.minTaskCount}, Max Task Count: ${slab.maxTaskCount}`);
  
      // Check if the completed task count falls within the slab's task range
      if (completedTaskCount >= slab.minTaskCount && completedTaskCount <= slab.maxTaskCount) {
        // Calculate incentive amount based on the slab percentage
        incentiveAmount = basicSalary * slab.percentage / 100;
        console.log(`Task count falls within this slab. Calculated incentive: ₹${incentiveAmount}`);
        break; // Stop once a matching slab is found
      } else {
        console.log("Task count does not fall within this slab's range.");
      }
    }
  
    if (incentiveAmount === 0) {
      console.log("No matching slab found. Returning incentive amount: ₹0");
    }
  
    return incentiveAmount;
  };
  