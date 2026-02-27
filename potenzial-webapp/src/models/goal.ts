import { toMoney } from "./entry";
import type { Entry, Goal } from "./types";

export const DEFAULT_GOAL: Goal = {
  title: "Europe Trip",
  targetAmount: 5000,
  deadline: ""
};

export function sanitizeGoalInput(input: Partial<Goal> | null | undefined, fallback: Goal = DEFAULT_GOAL): Goal {
  const title = String(input?.title ?? fallback.title).trim() || DEFAULT_GOAL.title;
  const targetAmount = toMoney(input?.targetAmount ?? fallback.targetAmount);
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
  const totalSaved = toMoney(entries.reduce((sum, entry) => sum + toMoney(entry.potential), 0));
  const sanitizedTarget = toMoney(targetAmount);
  const rawPercent = sanitizedTarget > 0 ? (totalSaved / sanitizedTarget) * 100 : 0;

  return {
    totalSaved,
    targetAmount: sanitizedTarget,
    progressPercent: Math.round(Math.max(0, rawPercent)),
    progressRingPercent: Math.max(0, Math.min(100, rawPercent))
  };
}
