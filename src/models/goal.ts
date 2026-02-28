import { coerceStoredAmountToCents, normalizeCents } from "./format";
import { STORAGE_VERSION } from "./types";
import type { Entry, Goal } from "./types";

export const DEFAULT_GOAL: Goal = {
  title: "Europa-Reise",
  targetAmount: 500000,
  deadline: ""
};

export function sanitizeGoalInput(
  input: Partial<Goal> | null | undefined,
  fallback: Goal = DEFAULT_GOAL,
  sourceVersion: number = STORAGE_VERSION
): Goal {
  const title = String(input?.title ?? fallback.title).trim() || DEFAULT_GOAL.title;
  const targetRaw = input?.targetAmount ?? fallback.targetAmount;
  const targetAmount =
    sourceVersion < STORAGE_VERSION ? coerceStoredAmountToCents(targetRaw, sourceVersion) : normalizeCents(targetRaw);
  const deadlineValue = String(input?.deadline ?? fallback.deadline ?? "").trim();
  const deadline = /^\d{4}-\d{2}-\d{2}$/.test(deadlineValue) ? deadlineValue : "";

  return {
    title,
    targetAmount,
    deadline
  };
}

export function computeGoalProgress(entries: Entry[], targetAmount: number): {
  totalSaved: number;
  targetAmount: number;
  progressPercent: number;
  progressRingPercent: number;
} {
  const totalSaved = Math.max(0, Math.round(entries.reduce((sum, entry) => sum + entry.potential, 0)));
  const sanitizedTarget = Math.max(0, Math.round(targetAmount));
  const rawPercent = sanitizedTarget > 0 ? (totalSaved / sanitizedTarget) * 100 : 0;

  return {
    totalSaved,
    targetAmount: sanitizedTarget,
    progressPercent: Math.round(Math.max(0, rawPercent)),
    progressRingPercent: Math.max(0, Math.min(100, rawPercent))
  };
}
