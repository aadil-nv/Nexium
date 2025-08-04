interface IPreApprovedLeave {
    leaveType: string;
    totalDuration: number;  
  }
  
  const workTimeMapping: { [key: string]: number } = {
    "Full-Time": 480,   
    "Part-Time": 240,    
    "Contract": 540,     
    "Temporary": 420,    
  };
  
  export const calculateTotalPayableMinutes = (preApprovedLeaves: IPreApprovedLeave[], workShift: string): number => {
    let totalPayableMinutes = 0;
  
    const normalizedWorkShift = workShift.toString()
    const workShiftMinutes = workTimeMapping[normalizedWorkShift];
  
    if (!workShiftMinutes) {
      console.error("Invalid workShift value provided:", workShift);
      return totalPayableMinutes;
    }
  
    preApprovedLeaves.forEach(leave => {
      if (leave.leaveType === 'unpaidLeave') {
        return;
      }
      
      const leaveMinutes = leave.totalDuration * workShiftMinutes;  
      totalPayableMinutes += leaveMinutes;
    });
  
  
    return totalPayableMinutes;
  };
  