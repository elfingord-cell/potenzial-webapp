const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function todayISODate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeISODate(value?: string | null): string {
  if (typeof value === "string" && ISO_DATE_PATTERN.test(value)) {
    return value;
  }

  if (typeof value === "string" && ISO_DATE_PATTERN.test(value.slice(0, 10))) {
    return value.slice(0, 10);
  }

  return todayISODate();
}

export function parseISODate(value: string): Date {
  const [year, month, day] = normalizeISODate(value).split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfWeekMonday(date: Date): Date {
  const day = (date.getDay() + 6) % 7;
  return addDays(startOfDay(date), -day);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isYesterday(candidate: Date, reference: Date): boolean {
  const yesterday = addDays(startOfDay(reference), -1);
  return isSameDay(candidate, yesterday);
}

export function formatEntryDateLabel(dateValue: string, timeValue: string, now: Date = new Date()): string {
  const parsedDate = parseISODate(dateValue);
  const parsedTime = new Date(timeValue);
  const timeDate = Number.isNaN(parsedTime.getTime()) ? parsedDate : parsedTime;

  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(timeDate);

  if (isSameDay(parsedDate, now)) {
    return `Today, ${timeLabel}`;
  }

  if (isYesterday(parsedDate, now)) {
    return `Yesterday, ${timeLabel}`;
  }

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(parsedDate);

  return `${dateLabel}, ${timeLabel}`;
}
