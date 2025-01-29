import Holidays from 'date-holidays';

export const calculateWorkingDaysWithHolidays = (month: number, year: number, countryCode: string): number => {
  const hd = new Holidays(countryCode);

  // Total days in the given month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Fetch all holidays for the given year synchronously
  const allHolidays = hd.getHolidays(year);

  // Filter holidays for the specified month
  const holidaysInMonth = allHolidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getFullYear() === year && holidayDate.getMonth() === month;
  });

  // Count Sundays
  let sundayCount = 0;
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const date = new Date(year, month, day);

    // Check if the day is Sunday
    if (date.getDay() === 0) {
      sundayCount++;
    }
  }

  // Subtract Sundays and holidays from total days
  const workingDays = totalDaysInMonth - sundayCount - holidaysInMonth.length;

  // Return only the number of working days
  return workingDays;
};
