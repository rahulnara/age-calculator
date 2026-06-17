const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseInputDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function isSameInputDate(input, date) {
  return input === formatDateInput(date);
}

function differenceInYearsMonthsDays(startDate, endDate) {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function getNextBirthday(birthDate, compareDate) {
  const year = compareDate.getFullYear();
  let nextBirthday = new Date(year, birthDate.getMonth(), birthDate.getDate());

  if (nextBirthday < compareDate) {
    nextBirthday = new Date(year + 1, birthDate.getMonth(), birthDate.getDate());
  }

  return nextBirthday;
}

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

export function calculateAgeDetails(birthInput, compareInput) {
  const birthDate = parseInputDate(birthInput);
  const compareDate = parseInputDate(compareInput);

  if (!birthDate || !compareDate || !isSameInputDate(birthInput, birthDate) || !isSameInputDate(compareInput, compareDate)) {
    return { isValid: false, error: 'Please use valid dates.' };
  }

  if (birthDate > compareDate) {
    return { isValid: false, error: 'Birth date cannot be after the selected current date.' };
  }

  const diff = differenceInYearsMonthsDays(birthDate, compareDate);
  const totalDays = Math.floor((compareDate - birthDate) / DAY_IN_MS);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = diff.years * 12 + diff.months;
  const nextBirthday = getNextBirthday(birthDate, compareDate);
  const daysUntilBirthday = Math.ceil((nextBirthday - compareDate) / DAY_IN_MS);
  const lastBirthday = new Date(nextBirthday);
  lastBirthday.setFullYear(nextBirthday.getFullYear() - 1);
  const birthdayCycleDays = Math.max(1, Math.ceil((nextBirthday - lastBirthday) / DAY_IN_MS));
  const birthdayProgress = Math.min(
    100,
    Math.max(0, Math.round(((birthdayCycleDays - daysUntilBirthday) / birthdayCycleDays) * 100)),
  );

  return {
    isValid: true,
    ...diff,
    totalDays,
    totalWeeks,
    totalMonths,
    daysUntilBirthday,
    birthdayProgress,
    nextBirthday: formatDateInput(nextBirthday),
    ageLabel: `${pluralize(diff.years, 'year')}, ${pluralize(diff.months, 'month')}, ${pluralize(diff.days, 'day')}`,
  };
}
