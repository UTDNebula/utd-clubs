/*
Utilities to fetch extra days worth of events.
Used to perform optimistic fetching for pagination.
*/

import { addDays, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

export type CalendarRange = { startDate: string; endDate: string };

type CalendarView = 'Day' | 'Week' | 'Month';

const BUFFER_DAYS = {
  Day: {
    // Last 3 days through next 3
    before: 3,
    after: 1 + 3,
  },
  Week: {
    // Last 2 weeks through next 2
    before: 7 * 2,
    after: 7 * 3,
  },
  Month: {
    // Last month through next month
    before: 31,
    after: 31 + 31,
  },
};

function createBufferedRange(
  view: CalendarView,
  baseDate: Date,
): CalendarRange {
  return {
    startDate: addDays(baseDate, -BUFFER_DAYS[view].before).toISOString(),
    endDate: addDays(baseDate, BUFFER_DAYS[view].after).toISOString(),
  };
}

export function getRangeForView(view: string, anchor: Date): CalendarRange {
  if (view === 'Day') {
    return createBufferedRange(view, startOfDay(anchor));
  }
  if (view === 'Week') {
    return createBufferedRange(view, startOfWeek(anchor));
  }
  return createBufferedRange('Month', startOfMonth(anchor));
}
