const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const euroInputFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const dateFormatterShort = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const dateTimeFormatterShort = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});

const timeFormatter = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit"
});

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function normalizeCents(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.round(numeric));
}

export function formatEuro(cents: number): string {
  return euroFormatter.format(normalizeCents(cents) / 100);
}

export function formatEuroInput(cents: number): string {
  const normalized = normalizeCents(cents);
  if (normalized <= 0) {
    return "";
  }

  return euroInputFormatter.format(normalized / 100);
}

export function parseEuroInput(input: string): number | null {
  if (typeof input !== "string") {
    return null;
  }

  const raw = input.trim();
  if (!raw) {
    return null;
  }

  let sanitized = raw.replace(/[€\s]/g, "").replace(/[^\d,.-]/g, "");
  sanitized = sanitized.replace(/-/g, "");

  if (!sanitized) {
    return null;
  }

  const lastComma = sanitized.lastIndexOf(",");
  const lastDot = sanitized.lastIndexOf(".");
  let normalized = sanitized;

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      normalized = sanitized.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = sanitized.replace(/,/g, "");
    }
  } else if (lastComma >= 0) {
    normalized = sanitized.replace(/\./g, "").replace(",", ".");
  } else if (lastDot >= 0) {
    const dotParts = sanitized.split(".");
    const hasThousandsGroups =
      dotParts.length > 1 && dotParts.slice(1).every((part) => part.length === 3) && dotParts[0].length > 0;
    normalized = hasThousandsGroups ? dotParts.join("") : sanitized;
  }

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.max(0, Math.round(numeric * 100));
}

export function coerceStoredAmountToCents(value: unknown, sourceVersion: number): number {
  if (sourceVersion <= 1) {
    if (typeof value === "string") {
      const parsed = parseEuroInput(value);
      return parsed === null ? 0 : parsed;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return 0;
    }

    return Math.max(0, Math.round(numeric * 100));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return normalizeCents(trimmed);
    }

    const parsed = parseEuroInput(trimmed);
    if (parsed !== null) {
      return parsed;
    }
  }

  return normalizeCents(value);
}

export function formatDateTimeDE(date: Date, mode: "short" | "relative" = "short"): string {
  if (mode === "short") {
    return dateFormatterShort.format(date);
  }

  const now = new Date();
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const timeLabel = timeFormatter.format(date);

  if (isSameDay(date, today)) {
    return `Heute, ${timeLabel}`;
  }

  if (isSameDay(date, yesterday)) {
    return `Gestern, ${timeLabel}`;
  }

  return dateTimeFormatterShort.format(date);
}
