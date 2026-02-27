import { computeGoalProgress } from "./models/goal";
import { computeInsights } from "./models/insights";
import { createEntryFromDraft, sortEntriesByMostRecent, toDraftFromEntry } from "./models/entry";
import { todayISODate } from "./models/date";
import { ENTRY_TYPES, type EntryDraftInput, type EntryType, type Route } from "./models/types";
import { createStore } from "./storage/store";
import { renderBottomNav, renderFab } from "./ui/components";
import { renderEntriesScreen, renderEntrySheet, renderHomeScreen, renderInsightsScreen } from "./ui/screens";

const VALID_ROUTES: Route[] = ["home", "entries", "insights"];

interface SheetDraftValues {
  type: EntryType;
  amount: string;
  referencePrice: string;
  paidPrice: string;
  note: string;
  date: string;
}

interface SheetState {
  open: boolean;
  mode: "create" | "edit";
  editingId: string | null;
  error: string;
  draft: SheetDraftValues;
}

function isRoute(value: string): value is Route {
  return VALID_ROUTES.includes(value as Route);
}

function getRouteFromHash(hash: string = window.location.hash): Route {
  const normalized = hash.replace(/^#\/?/, "").trim().toLowerCase();
  return isRoute(normalized) ? normalized : "home";
}

function defaultSheetDraft(type: EntryType = "avoid"): SheetDraftValues {
  return {
    type,
    amount: "",
    referencePrice: "",
    paidPrice: "",
    note: "",
    date: todayISODate()
  };
}

function formatInputValue(value: number): string {
  return value > 0 ? value.toFixed(2) : "";
}

function getDraftFromEntry(entryId: string): SheetDraftValues {
  const entry = store.getEntryById(entryId);

  if (!entry) {
    return defaultSheetDraft();
  }

  const draft = toDraftFromEntry(entry);

  return {
    type: draft.type,
    amount: formatInputValue(draft.amount ?? 0),
    referencePrice: formatInputValue(draft.referencePrice ?? 0),
    paidPrice: formatInputValue(draft.paidPrice ?? 0),
    note: draft.note || "",
    date: draft.date || todayISODate()
  };
}

function buildEntryDraftFromForm(form: HTMLFormElement): EntryDraftInput {
  const formData = new FormData(form);
  const typeValue = String(formData.get("type") || "avoid");
  const type = ENTRY_TYPES.includes(typeValue as EntryType) ? (typeValue as EntryType) : "avoid";

  const draft: EntryDraftInput = {
    type,
    date: String(formData.get("date") || todayISODate()),
    note: String(formData.get("note") || "")
  };

  if (type === "cheaper") {
    draft.referencePrice = Number(formData.get("referencePrice") || 0);
    draft.paidPrice = Number(formData.get("paidPrice") || 0);
  } else {
    draft.amount = Number(formData.get("amount") || 0);
  }

  return draft;
}

function readDraftStateFromForm(form: HTMLFormElement): SheetDraftValues {
  const formData = new FormData(form);
  const typeValue = String(formData.get("type") || "avoid");
  const type = ENTRY_TYPES.includes(typeValue as EntryType) ? (typeValue as EntryType) : "avoid";

  return {
    type,
    amount: String(formData.get("amount") || ""),
    referencePrice: String(formData.get("referencePrice") || ""),
    paidPrice: String(formData.get("paidPrice") || ""),
    note: String(formData.get("note") || ""),
    date: String(formData.get("date") || todayISODate())
  };
}

function navigate(route: Route): void {
  const nextHash = `#/${route}`;

  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash;
    return;
  }

  currentRoute = route;
  render();
}

function openCreateSheet(): void {
  sheet.open = true;
  sheet.mode = "create";
  sheet.editingId = null;
  sheet.error = "";
  sheet.draft = defaultSheetDraft("avoid");
  render();
}

function openEditSheet(entryId: string): void {
  const entry = store.getEntryById(entryId);
  if (!entry) {
    return;
  }

  sheet.open = true;
  sheet.mode = "edit";
  sheet.editingId = entry.id;
  sheet.error = "";
  sheet.draft = getDraftFromEntry(entryId);
  render();
}

function closeSheet(): void {
  sheet.open = false;
  sheet.mode = "create";
  sheet.editingId = null;
  sheet.error = "";
  sheet.draft = defaultSheetDraft();
  render();
}

function updateGoalViaPrompt(): void {
  const state = store.getState();
  const title = window.prompt("Goal title", state.goal.title);
  if (title === null) {
    return;
  }

  const targetText = window.prompt("Target amount (USD)", String(state.goal.targetAmount));
  if (targetText === null) {
    return;
  }

  const parsedTarget = Number(targetText);
  store.saveGoal({
    title,
    targetAmount: Number.isFinite(parsedTarget) ? parsedTarget : state.goal.targetAmount
  });

  render();
}

function handleDeleteEntry(entryId: string): void {
  const entry = store.getEntryById(entryId);
  if (!entry) {
    return;
  }

  const shouldDelete = window.confirm("Delete this entry?");
  if (!shouldDelete) {
    return;
  }

  store.deleteEntry(entryId);
  render();
}

function handleSheetSubmit(form: HTMLFormElement): void {
  sheet.draft = readDraftStateFromForm(form);
  const draft = buildEntryDraftFromForm(form);

  const draftValidation = createEntryFromDraft(draft);
  if (!draftValidation.entry || draftValidation.error) {
    sheet.error = draftValidation.error;
    render();
    return;
  }

  const result =
    sheet.mode === "edit" && sheet.editingId
      ? store.updateEntry(sheet.editingId, draft)
      : store.addEntry(draft);

  if (result.error) {
    sheet.error = result.error;
    render();
    return;
  }

  closeSheet();
}

function render(): void {
  const state = store.getState();
  const entries = sortEntriesByMostRecent(state.entries);
  const goalProgress = computeGoalProgress(entries, state.goal.targetAmount);
  const insights = computeInsights(entries);

  let screenMarkup = "";

  if (currentRoute === "home") {
    screenMarkup = renderHomeScreen({
      goalTitle: state.goal.title,
      totalSaved: goalProgress.totalSaved,
      targetAmount: goalProgress.targetAmount,
      progressPercent: goalProgress.progressPercent,
      progressRingPercent: goalProgress.progressRingPercent,
      recentEntries: entries.slice(0, 3)
    });
  }

  if (currentRoute === "entries") {
    screenMarkup = renderEntriesScreen({
      monthTotal: insights.monthTotal,
      monthChangePercent: insights.monthChangePercent,
      entries
    });
  }

  if (currentRoute === "insights") {
    screenMarkup = renderInsightsScreen({ insights });
  }

  appRoot.innerHTML = `
    <div class="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background-light font-display text-slate-900">
      ${screenMarkup}
      ${renderFab()}
      ${renderBottomNav(currentRoute)}
      ${renderEntrySheet({
        open: sheet.open,
        mode: sheet.mode,
        type: sheet.draft.type,
        amount: sheet.draft.amount,
        referencePrice: sheet.draft.referencePrice,
        paidPrice: sheet.draft.paidPrice,
        note: sheet.draft.note,
        date: sheet.draft.date,
        error: sheet.error
      })}
    </div>
  `;
}

function handleClick(event: Event): void {
  const target = event.target as HTMLElement | null;
  if (!target) {
    return;
  }

  const actionable = target.closest<HTMLElement>("[data-action]");
  if (!actionable) {
    return;
  }

  const action = actionable.dataset.action || "";

  if (action === "navigate") {
    event.preventDefault();
    const route = actionable.dataset.route || "home";
    navigate(isRoute(route) ? route : "home");
    return;
  }

  if (action === "open-sheet") {
    event.preventDefault();
    openCreateSheet();
    return;
  }

  if (action === "close-sheet") {
    event.preventDefault();
    closeSheet();
    return;
  }

  if (action === "edit-entry") {
    const entryId = actionable.dataset.entryId;
    if (entryId) {
      event.preventDefault();
      openEditSheet(entryId);
    }
    return;
  }

  if (action === "delete-entry") {
    const entryId = actionable.dataset.entryId;
    if (entryId) {
      event.preventDefault();
      handleDeleteEntry(entryId);
    }
    return;
  }

  if (action === "edit-goal") {
    event.preventDefault();
    updateGoalViaPrompt();
  }
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
  if (!target || !sheet.open) {
    return;
  }

  const form = target.closest("form");
  if (!(form instanceof HTMLFormElement) || form.id !== "entry-sheet-form") {
    return;
  }

  if (target.name === "type") {
    const nextType = target.value;
    if (ENTRY_TYPES.includes(nextType as EntryType)) {
      sheet.draft = {
        ...readDraftStateFromForm(form),
        type: nextType as EntryType
      };
      sheet.error = "";
      render();
    }
    return;
  }

  sheet.draft = readDraftStateFromForm(form);
}

function handleSubmit(event: Event): void {
  const target = event.target as HTMLElement | null;
  if (!(target instanceof HTMLFormElement)) {
    return;
  }

  if (target.id === "entry-sheet-form") {
    event.preventDefault();
    handleSheetSubmit(target);
  }
}

const store = createStore();
let currentRoute: Route = getRouteFromHash();

const sheet: SheetState = {
  open: false,
  mode: "create",
  editingId: null,
  error: "",
  draft: defaultSheetDraft()
};

let appRoot: HTMLElement;

export function initApp(root: HTMLElement): void {
  appRoot = root;

  if (!window.location.hash) {
    window.location.hash = "#/home";
  }

  currentRoute = getRouteFromHash();

  window.addEventListener("hashchange", () => {
    currentRoute = getRouteFromHash();
    render();
  });

  root.addEventListener("click", handleClick);
  root.addEventListener("input", handleInput);
  root.addEventListener("submit", handleSubmit);

  render();
}
