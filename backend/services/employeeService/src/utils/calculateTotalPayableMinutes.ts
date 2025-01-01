interface IPreApprovedLeave {
    leaveType: string;
    totalDuration: number;  // Duration in days
  }
  
  const workTimeMapping: { [key: string]: number } = {
    "Full-Time": 480,    // 8 hours in minutes (8 * 60)
    "Part-Time": 240,    // 4 hours in minutes (4 * 60)
    "Contract": 540,     // 9 hours in minutes (9 * 60)
    "Temporary": 420,    // 7 hours in minutes (7 * 60)
  };
  
  export const calculateTotalPayableMinutes = (preApprovedLeaves: IPreApprovedLeave[], workShift: string): number => {
    console.log("preApprovedLeaves from function ---------------111", preApprovedLeaves);
    console.log("workShift from function ---------------444", workShift);
    console.log("workTimeMapping from function ---------------666",typeof workShift);
    
  
    let totalPayableMinutes = 0;
  
    // Normalize the workShift to match the keys in the workTimeMapping (case insensitive)
    const normalizedWorkShift = workShift.toString()
    console.log("normalizedWorkShift from function ---------------555", normalizedWorkShift);
    
  
    // Get the corresponding work shift time in minutes from the workTimeMapping based on employee's workShiftType
    const workShiftMinutes = workTimeMapping[normalizedWorkShift];
  
    console.log("workShiftMinutes from function ---------------222222", workShiftMinutes);
  
    if (!workShiftMinutes) {
      console.error("Invalid workShift value provided:", workShift);
      return totalPayableMinutes;
    }
  
    // Loop through each pre-approved leave and calculate the total payable minutes
    preApprovedLeaves.forEach(leave => {
      // Skip the leave if the leaveType is 'unpaidLeave'
      if (leave.leaveType === 'unpaidLeave') {
        return;
      }
      
      // Calculate the payable minutes for leave if it's not 'unpaidLeave'
      const leaveMinutes = leave.totalDuration * workShiftMinutes;  // Total duration * work shift minutes per day
      totalPayableMinutes += leaveMinutes;
    });
  
    console.log("totalPayableMinutes from function ---------------333333", totalPayableMinutes);
  
    return totalPayableMinutes;
  };
  