import Holidays from 'date-holidays';

export const calculateWorkingDaysWithHolidays = (month: number, year: number, countryCode: string): number => {
  const hd = new Holidays(countryCode);

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const allHolidays = hd.getHolidays(year);

  const holidaysInMonth = allHolidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getFullYear() === year && holidayDate.getMonth() === month;
  });

  let sundayCount = 0;
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const date = new Date(year, month, day);

    if (date.getDay() === 0) {
      sundayCount++;
    }
  }

  const workingDays = totalDaysInMonth - sundayCount - holidaysInMonth.length;

  return workingDays;
};
