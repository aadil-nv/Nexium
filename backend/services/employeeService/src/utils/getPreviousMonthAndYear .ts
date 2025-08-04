export const getPreviousMonthAndYear = (today: Date): { previousMonth: string, previousYear: number } => {
    const previousMonthIndex = today.getMonth() - 1;
  
    const previousMonth = previousMonthIndex < 0 ? 11 : previousMonthIndex;
    const previousYear = previousMonthIndex < 0 ? today.getFullYear() - 1 : today.getFullYear();
  
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const previousMonthName = monthNames[previousMonth];
  
    return { previousMonth: previousMonthName, previousYear };
  };
  
  