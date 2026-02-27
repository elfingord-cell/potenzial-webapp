import { addDays, endOfMonth, parseISODate, startOfDay, startOfMonth, startOfWeekMonday, todayISODate } from "./date";
import { ENTRY_TYPE_META, type Entry, type EntryType } from "./types";

export interface DaySeriesPoint {
  label: string;
  value: number;
  date: string;
}

export interface InsightsSnapshot {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  previousWeekTotal: number;
  previousMonthTotal: number;
  weekChangePercent: number;
  monthChangePercent: number;
  last7Total: number;
  series: DaySeriesPoint[];
  averageDailySaved: number;
  topCategory: string;
  projectedMonthly: number;
}

function sumEntriesBetween(entries: Entry[], rangeStart: Date, rangeEnd: Date): number {
  let total = 0;

  for (const entry of entries) {
    const entryDate = parseISODate(entry.date);
    if (entryDate >= rangeStart && entryDate < rangeEnd) {
      total += entry.potential;
    }
  }

  return Math.max(0, Math.round(total));
}

function computeChangePercent(current: number, previous: number): number {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function computeInsights(entries: Entry[], now: Date = new Date()): InsightsSnapshot {
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const weekStart = startOfWeekMonday(now);
  const previousWeekStart = addDays(weekStart, -7);
  const monthStart = startOfMonth(now);
  const previousMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1);

  const todayTotal = sumEntriesBetween(entries, today, tomorrow);
  const weekTotal = sumEntriesBetween(entries, weekStart, tomorrow);
  const monthTotal = sumEntriesBetween(entries, monthStart, tomorrow);
  const previousWeekTotal = sumEntriesBetween(entries, previousWeekStart, weekStart);
  const previousMonthTotal = sumEntriesBetween(entries, previousMonthStart, monthStart);

  const series: DaySeriesPoint[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const pointDate = addDays(today, -offset);
    const pointEnd = addDays(pointDate, 1);
    const dayLabel = new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(pointDate).replace(".", "");

    series.push({
      label: dayLabel,
      value: sumEntriesBetween(entries, pointDate, pointEnd),
      date: todayISODate(pointDate)
    });
  }

  const last7Total = Math.max(0, Math.round(series.reduce((sum, point) => sum + point.value, 0)));
  const daysElapsed = Math.max(1, now.getDate());
  const averageDailySaved = Math.max(0, Math.round(monthTotal / daysElapsed));
  const daysInMonth = endOfMonth(now).getDate();
  const projectedMonthly = Math.max(0, Math.round(averageDailySaved * daysInMonth));

  const categoryTotals: Record<EntryType, number> = {
    avoid: 0,
    cheaper: 0,
    income: 0
  };

  for (const entry of entries) {
    const entryDate = parseISODate(entry.date);
    if (entryDate >= monthStart && entryDate < tomorrow) {
      categoryTotals[entry.type] += entry.potential;
    }
  }

  const [topCategoryType, topCategoryValue] = (Object.entries(categoryTotals) as [EntryType, number][]).sort(
    (left, right) => right[1] - left[1]
  )[0] || [null, 0];

  const topCategory =
    topCategoryType && topCategoryValue > 0 ? ENTRY_TYPE_META[topCategoryType].label : "Keine Eintraege";

  return {
    todayTotal,
    weekTotal,
    monthTotal,
    previousWeekTotal,
    previousMonthTotal,
    weekChangePercent: computeChangePercent(weekTotal, previousWeekTotal),
    monthChangePercent: computeChangePercent(monthTotal, previousMonthTotal),
    last7Total,
    series,
    averageDailySaved,
    topCategory,
    projectedMonthly
  };
}
