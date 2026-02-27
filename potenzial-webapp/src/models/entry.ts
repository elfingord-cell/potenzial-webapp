import { formatEntryDateLabel, normalizeISODate } from "./date";
import { coerceStoredAmountToCents, formatEuro, parseEuroInput } from "./format";
import { ENTRY_TYPE_META, ENTRY_TYPES, STORAGE_VERSION, type Entry, type EntryDraftInput, type EntryType } from "./types";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function isEntryType(value: unknown): value is EntryType {
  return typeof value === "string" && ENTRY_TYPES.includes(value as EntryType);
}

function centsFromDraftValue(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return null;
    }
    return Math.max(0, Math.round(value * 100));
  }

  if (typeof value === "string") {
    return parseEuroInput(value);
  }

  return null;
}

export function computePotential(type: EntryType, paidPrice: number, referencePrice: number, amount: number): number {
  if (type === "avoid") {
    return Math.max(0, referencePrice);
  }

  if (type === "cheaper") {
    return Math.max(0, referencePrice - paidPrice);
  }

  return Math.max(0, amount);
}

export function createEntryFromDraft(
  draft: EntryDraftInput,
  existingEntry?: Entry
): { entry: Entry | null; error: string } {
  if (!isEntryType(draft.type)) {
    return { entry: null, error: "Bitte waehle einen gueltigen Eintragstyp." };
  }

  const nowIso = new Date().toISOString();
  const note = String(draft.note || "").trim();
  const date = normalizeISODate(draft.date);

  let paidPrice = 0;
  let referencePrice = 0;
  let amount = 0;

  if (draft.type === "avoid") {
    const parsedAmount = centsFromDraftValue(draft.amount);
    amount = parsedAmount ?? 0;
    referencePrice = amount;
    if (amount <= 0) {
      return { entry: null, error: "Bitte gib einen Betrag groesser als 0,00 EUR ein." };
    }
  }

  if (draft.type === "cheaper") {
    referencePrice = centsFromDraftValue(draft.referencePrice) ?? 0;
    paidPrice = centsFromDraftValue(draft.paidPrice) ?? 0;

    if (referencePrice <= 0) {
      return { entry: null, error: "Der Referenzpreis muss groesser als 0,00 EUR sein." };
    }

    if (referencePrice <= paidPrice) {
      return { entry: null, error: "Der Referenzpreis muss groesser als der bezahlte Preis sein." };
    }
  }

  if (draft.type === "income") {
    const parsedAmount = centsFromDraftValue(draft.amount);
    amount = parsedAmount ?? 0;
    if (amount <= 0) {
      return { entry: null, error: "Bitte gib einen Einkommensbetrag groesser als 0,00 EUR ein." };
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

export function sanitizeStoredEntry(raw: unknown, sourceVersion: number = STORAGE_VERSION): Entry | null {
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
    referencePrice = coerceStoredAmountToCents(candidate.referencePrice ?? candidate.potential, sourceVersion);
    potential = referencePrice;
    if (potential <= 0) {
      return null;
    }
  }

  if (candidate.type === "cheaper") {
    paidPrice = coerceStoredAmountToCents(candidate.paidPrice, sourceVersion);
    referencePrice = coerceStoredAmountToCents(candidate.referencePrice, sourceVersion);
    potential = referencePrice - paidPrice;
    if (referencePrice <= 0 || potential <= 0) {
      return null;
    }
  }

  if (candidate.type === "income") {
    potential = coerceStoredAmountToCents(candidate.potential ?? candidate.referencePrice ?? candidate.paidPrice, sourceVersion);
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

export function formatCurrency(amountCents: number): string {
  return formatEuro(amountCents);
}

export function formatSignedCurrency(amountCents: number): string {
  return `+${formatCurrency(amountCents)}`;
}

export function getEntryDisplayTitle(entry: Entry): string {
  if (entry.note) {
    return entry.note;
  }

  if (entry.type === "avoid") {
    return "Vermeideter Kauf";
  }

  if (entry.type === "cheaper") {
    return "Guenstigere Alternative";
  }

  return "Zusaetzliches Einkommen";
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
