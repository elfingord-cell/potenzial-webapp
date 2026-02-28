export const STORAGE_VERSION = 2;

export const ENTRY_TYPES = ["avoid", "cheaper", "income"] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export type Route = "home" | "entries" | "insights";

export interface Goal {
  title: string;
  // Stored as integer cents (EUR).
  targetAmount: number;
  deadline: string;
}

export interface Entry {
  id: string;
  date: string;
  type: EntryType;
  // All money values are stored as integer cents (EUR).
  paidPrice: number;
  referencePrice: number;
  potential: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  version: number;
  goal: Goal;
  entries: Entry[];
}

export interface EntryDraftInput {
  type: EntryType;
  amount?: string | number | null;
  paidPrice?: string | number | null;
  referencePrice?: string | number | null;
  note?: string;
  date?: string;
}

export interface EntryTypeMeta {
  label: string;
  amountLabel: string;
  icon: string;
  toneClassName: string;
}

export const ENTRY_TYPE_META: Record<EntryType, EntryTypeMeta> = {
  avoid: {
    label: "Verzicht",
    amountLabel: "Gesparter Betrag",
    icon: "local_cafe",
    toneClassName: "bg-orange-100 text-orange-600"
  },
  cheaper: {
    label: "G\u00fcnstiger",
    amountLabel: "Ersparnis",
    icon: "sell",
    toneClassName: "bg-blue-100 text-blue-600"
  },
  income: {
    label: "Einkommen",
    amountLabel: "Einkommensbetrag",
    icon: "work",
    toneClassName: "bg-purple-100 text-purple-600"
  }
};
