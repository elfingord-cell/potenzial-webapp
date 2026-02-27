import { sanitizeStoredEntry } from "../models/entry";
import { DEFAULT_GOAL, sanitizeGoalInput } from "../models/goal";
import { STORAGE_VERSION, type AppState, type Entry } from "../models/types";

export const STORAGE_KEY = "potenzial-webapp.state";

export function createEmptyState(): AppState {
  return {
    version: STORAGE_VERSION,
    goal: { ...DEFAULT_GOAL },
    entries: []
  };
}

export function migrateState(raw: unknown): AppState {
  if (!raw || typeof raw !== "object") {
    return createEmptyState();
  }

  const candidate = raw as Record<string, unknown>;
  const sourceVersion = typeof candidate.version === "number" ? candidate.version : 1;
  const goal = sanitizeGoalInput(candidate.goal as Partial<AppState["goal"]> | undefined, DEFAULT_GOAL, sourceVersion);

  const rawEntries = Array.isArray(candidate.entries)
    ? candidate.entries
    : Array.isArray(raw)
      ? raw
      : [];

  const entries = rawEntries
    .map((entry) => sanitizeStoredEntry(entry, sourceVersion))
    .filter((entry): entry is Entry => entry !== null);

  return {
    version: STORAGE_VERSION,
    goal,
    entries
  };
}
