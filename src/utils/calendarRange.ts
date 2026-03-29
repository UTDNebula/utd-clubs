import { addDays, startOfDay } from 'date-fns';

export type CalendarRange = { startDate: string; endDate: string };

const BUFFER_DAYS_BEFORE = 7;
const BUFFER_DAYS_AFTER = 21;

function getWeekStart(date: Date): Date {
  const d = startOfDay(date);
  return addDays(d, -d.getDay());
}

function createBufferedRange(baseDate: Date): CalendarRange {
  return {
    startDate: addDays(baseDate, -BUFFER_DAYS_BEFORE).toISOString(),
    endDate: addDays(baseDate, BUFFER_DAYS_AFTER).toISOString(),
  };
}

export function getBufferedRangeForDay(anchor: Date): CalendarRange {
  return createBufferedRange(startOfDay(anchor));
}

export function getBufferedRangeForWeek(anchor: Date): CalendarRange {
  return createBufferedRange(getWeekStart(anchor));
}

export function getBufferedRangeForMonth(anchor: Date): CalendarRange {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);

  return {
    startDate: addDays(getWeekStart(first), -BUFFER_DAYS_BEFORE).toISOString(),
    endDate: addDays(
      getWeekStart(addDays(last, 7)),
      BUFFER_DAYS_AFTER,
    ).toISOString(),
  };
}

export function getRangeForView(view: string, anchor: Date): CalendarRange {
  if (view === 'Day') return getBufferedRangeForDay(anchor);
  if (view === 'Month') return getBufferedRangeForMonth(anchor);
  return getBufferedRangeForWeek(anchor);
}
