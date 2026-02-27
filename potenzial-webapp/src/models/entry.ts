import { formatEntryDateLabel, normalizeISODate } from "./date";
import { ENTRY_TYPE_META, ENTRY_TYPES, type Entry, type EntryDraftInput, type EntryType } from "./types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function toMoney(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.round(numeric * 100) / 100);
}

function isEntryType(value: unknown): value is EntryType {
  return typeof value === "string" && ENTRY_TYPES.includes(value as EntryType);
}

export function computePotential(type: EntryType, paidPrice: number, referencePrice: number, amount: number): number {
  if (type === "avoid") {
    return toMoney(referencePrice);
  }

  if (type === "cheaper") {
    return toMoney(referencePrice - paidPrice);
  }

  return toMoney(amount);
}

export function createEntryFromDraft(
  draft: EntryDraftInput,
  existingEntry?: Entry
): { entry: Entry | null; error: string } {
  if (!isEntryType(draft.type)) {
    return { entry: null, error: "Please choose a valid entry type." };
  }

  const nowIso = new Date().toISOString();
  const note = String(draft.note || "").trim();
  const date = normalizeISODate(draft.date);

  let paidPrice = 0;
  let referencePrice = 0;
  let amount = 0;

  if (draft.type === "avoid") {
    amount = toMoney(draft.amount);
    referencePrice = amount;
    if (amount <= 0) {
      return { entry: null, error: "Amount saved must be greater than $0.00." };
    }
  }

  if (draft.type === "cheaper") {
    referencePrice = toMoney(draft.referencePrice);
    paidPrice = toMoney(draft.paidPrice);

    if (referencePrice <= 0) {
      return { entry: null, error: "Usual price must be greater than $0.00." };
    }

    const potential = computePotential(draft.type, paidPrice, referencePrice, amount);
    if (potential <= 0) {
      return { entry: null, error: "Cheaper entry must save more than $0.00." };
    }
  }

  if (draft.type === "income") {
    amount = toMoney(draft.amount);
    if (amount <= 0) {
      return { entry: null, error: "Income amount must be greater than $0.00." };
    }
  }

  const potential = computePotential(draft.type, paidPrice, referencePrice, amount);
  const entry: Entry = {
    id: existingEntry?.id || createId(),
    date,
    type: draft.type,
    paidPrice,
    referencePrice,
    potential,
    note,
    createdAt: existingEntry?.createdAt || nowIso,
    updatedAt: nowIso
  };

  return { entry, error: "" };
}

export function sanitizeStoredEntry(raw: unknown): Entry | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as Partial<Entry> & Record<string, unknown>;
  if (!isEntryType(candidate.type)) {
    return null;
  }

  const id = typeof candidate.id === "string" && candidate.id ? candidate.id : createId();
  const note = typeof candidate.note === "string" ? candidate.note.trim() : "";
  const date = normalizeISODate(typeof candidate.date === "string" ? candidate.date : undefined);

  const createdAt = typeof candidate.createdAt === "string" ? candidate.createdAt : new Date(`${date}T00:00:00`).toISOString();
  const updatedAt = typeof candidate.updatedAt === "string" ? candidate.updatedAt : createdAt;

  let paidPrice = 0;
  let referencePrice = 0;
  let potential = 0;

  if (candidate.type === "avoid") {
    referencePrice = toMoney(candidate.referencePrice ?? candidate.potential);
    potential = referencePrice;
    if (potential <= 0) {
      return null;
    }
  }

  if (candidate.type === "cheaper") {
    paidPrice = toMoney(candidate.paidPrice);
    referencePrice = toMoney(candidate.referencePrice);
    potential = toMoney(referencePrice - paidPrice);
    if (referencePrice <= 0 || potential <= 0) {
      return null;
    }
  }

  if (candidate.type === "income") {
    potential = toMoney(candidate.potential ?? candidate.referencePrice ?? candidate.paidPrice);
    if (potential <= 0) {
      return null;
    }
  }

  return {
    id,
    date,
    type: candidate.type,
    paidPrice,
    referencePrice,
    potential,
    note,
    createdAt,
    updatedAt
  };
}

export function sortEntriesByMostRecent(entries: Entry[]): Entry[] {
  return [...entries].sort((left, right) => {
    const dateSort = right.date.localeCompare(left.date);
    if (dateSort !== 0) {
      return dateSort;
    }
    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(toMoney(amount));
}

export function formatSignedCurrency(amount: number): string {
  return `+${formatCurrency(amount)}`;
}

export function getEntryDisplayTitle(entry: Entry): string {
  if (entry.note) {
    return entry.note;
  }

  if (entry.type === "avoid") {
    return "Avoided purchase";
  }

  if (entry.type === "cheaper") {
    return "Cheaper alternative";
  }

  return "Extra income";
}

export function getEntryTypeLabel(type: EntryType): string {
  return ENTRY_TYPE_META[type].label;
}

export function getEntryDateText(entry: Entry): string {
  return formatEntryDateLabel(entry.date, entry.updatedAt);
}

export function toDraftFromEntry(entry: Entry): EntryDraftInput {
  if (entry.type === "cheaper") {
    return {
      type: entry.type,
      note: entry.note,
      date: entry.date,
      paidPrice: entry.paidPrice,
      referencePrice: entry.referencePrice
    };
  }

  if (entry.type === "avoid") {
    return {
      type: entry.type,
      note: entry.note,
      date: entry.date,
      amount: entry.referencePrice
    };
  }

  return {
    type: entry.type,
    note: entry.note,
    date: entry.date,
    amount: entry.potential
  };
}
