export const getPreviousMonthAndYear = (today: Date): { previousMonth: string, previousYear: number } => {
    // Get the previous month index
    const previousMonthIndex = today.getMonth() - 1;
  
    // If the previous month is negative, it means it's December of the previous year
    const previousMonth = previousMonthIndex < 0 ? 11 : previousMonthIndex;
    const previousYear = previousMonthIndex < 0 ? today.getFullYear() - 1 : today.getFullYear();
  
    // Array of month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Get the name of the previous month
    const previousMonthName = monthNames[previousMonth];
  
    return { previousMonth: previousMonthName, previousYear };
  };
  
  