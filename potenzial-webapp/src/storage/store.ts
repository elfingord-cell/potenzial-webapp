import { createEntryFromDraft, sortEntriesByMostRecent } from "../models/entry";
import { sanitizeGoalInput } from "../models/goal";
import type { AppState, Entry, EntryDraftInput, Goal } from "../models/types";
import { createEmptyState, migrateState, STORAGE_KEY } from "./migrations";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readPersistedState(): unknown {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writePersistedState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore write failures (storage quota/private mode).
  }
}

export interface EntryResult {
  entry: Entry | null;
  error: string;
}

export function createStore() {
  let state = migrateState(readPersistedState());

  if (!state || typeof state !== "object") {
    state = createEmptyState();
  }

  writePersistedState(state);

  function persist(): void {
    writePersistedState(state);
  }

  return {
    getState(): AppState {
      return {
        ...clone(state),
        entries: sortEntriesByMostRecent(clone(state.entries))
      };
    },

    getEntryById(entryId: string): Entry | null {
      const entry = state.entries.find((item) => item.id === entryId);
      return entry ? clone(entry) : null;
    },

    saveGoal(goalPatch: Partial<Goal>): Goal {
      state.goal = sanitizeGoalInput(goalPatch, state.goal);
      persist();
      return clone(state.goal);
    },

    addEntry(draft: EntryDraftInput): EntryResult {
      const { entry, error } = createEntryFromDraft(draft);
      if (!entry || error) {
        return { entry: null, error: error || "Could not save entry." };
      }

      state.entries.push(entry);
      persist();
      return { entry: clone(entry), error: "" };
    },

    updateEntry(entryId: string, draft: EntryDraftInput): EntryResult {
      const index = state.entries.findIndex((item) => item.id === entryId);
      if (index < 0) {
        return { entry: null, error: "Entry not found." };
      }

      const existing = state.entries[index];
      const { entry, error } = createEntryFromDraft(
        {
          ...draft,
          date: draft.date || existing.date
        },
        existing
      );

      if (!entry || error) {
        return { entry: null, error: error || "Could not update entry." };
      }

      state.entries[index] = entry;
      persist();
      return { entry: clone(entry), error: "" };
    },

    deleteEntry(entryId: string): boolean {
      const before = state.entries.length;
      state.entries = state.entries.filter((item) => item.id !== entryId);
      const changed = state.entries.length !== before;
      if (changed) {
        persist();
      }
      return changed;
    }
  };
}
