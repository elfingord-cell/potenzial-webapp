import type { InsightsSnapshot } from "../models/insights";
import { ENTRY_TYPE_META, type Entry, type EntryType } from "../models/types";
import {
  escapeHtml,
  formatChangeText,
  formatMoney,
  formatTargetChip,
  renderEmptyCard,
  renderEntryRow,
  renderStatRow
} from "./components";

interface HomeScreenData {
  goalTitle: string;
  totalSaved: number;
  targetAmount: number;
  progressPercent: number;
  progressRingPercent: number;
  recentEntries: Entry[];
}

interface EntriesScreenData {
  monthTotal: number;
  monthChangePercent: number;
  entries: Entry[];
}

interface InsightsScreenData {
  insights: InsightsSnapshot;
}

interface EntrySheetViewModel {
  open: boolean;
  mode: "create" | "edit";
  type: EntryType;
  amount: string;
  referencePrice: string;
  paidPrice: string;
  note: string;
  date: string;
  error: string;
}

function renderProgressRing(progressPercent: number, progressRingPercent: number): string {
  return `
    <div class="relative w-full max-w-[320px] aspect-square flex items-center justify-center mb-6">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36" aria-label="${progressPercent}% abgeschlossen">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e7f3eb"
          stroke-width="2.5"
        ></path>
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#13ec5b"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-dasharray="${progressRingPercent}, 100"
        ></path>
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span class="text-5xl font-extrabold tracking-tight text-slate-900">${progressPercent}%</span>
        <span class="text-sm font-medium text-green-700 mt-1 uppercase tracking-wide">Abgeschlossen</span>
      </div>
    </div>
  `;
}

export function renderHomeScreen(data: HomeScreenData): string {
  const recentContent = data.recentEntries.length
    ? data.recentEntries.map((entry) => renderEntryRow(entry, false)).join("")
    : renderEmptyCard("Noch keine Aktivitaeten. Tippe auf +, um deinen ersten Eintrag anzulegen.");

  return `
    <header class="flex items-center justify-between px-6 pt-12 pb-4">
      <button class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-slate-900">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="text-lg font-bold tracking-tight">${escapeHtml(data.goalTitle)}</h1>
      <button class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-slate-900" data-action="edit-goal" aria-label="Ziel bearbeiten">
        <span class="material-symbols-outlined">settings</span>
      </button>
    </header>

    <main class="flex-1 flex flex-col items-center justify-start pt-6 px-6 overflow-y-auto pb-36">
      ${renderProgressRing(data.progressPercent, data.progressRingPercent)}

      <section class="text-center mb-8">
        <p class="text-sm font-medium text-green-700 mb-1">Gespart gesamt</p>
        <h2 class="text-6xl font-extrabold tracking-tight text-slate-900 mb-2">${formatMoney(data.totalSaved)}</h2>
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-green-700 text-xs font-semibold">
          ${formatTargetChip(data.targetAmount)}
        </div>
      </section>

      <section class="w-full max-w-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[2rem] leading-none font-bold text-slate-900">Letzte Aktivitaeten</h3>
          <button class="text-xl font-medium text-primary hover:underline" data-action="navigate" data-route="entries">Alle</button>
        </div>
        <div class="space-y-3">${recentContent}</div>
      </section>
    </main>
  `;
}

export function renderEntriesScreen(data: EntriesScreenData): string {
  const changeText = formatChangeText(data.monthChangePercent, "zum Vormonat");
  const entriesContent = data.entries.length
    ? data.entries.map((entry) => renderEntryRow(entry, true)).join("")
    : renderEmptyCard("Noch keine Eintraege. Lege Eintraege an, um deinen Verlauf zu sehen.");

  return `
    <header class="sticky top-0 z-10 bg-background-light/90 backdrop-blur-md border-b border-slate-200">
      <div class="px-4 py-3 flex items-center justify-between">
        <button class="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600" data-action="navigate" data-route="home">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">Aktivitaetsverlauf</h1>
        <button class="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600" data-action="navigate" data-route="insights">
          <span class="material-symbols-outlined">insights</span>
        </button>
      </div>
    </header>

    <main class="flex-1 px-4 py-6 overflow-y-auto pb-36">
      <section class="mb-8 p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-sm font-medium text-slate-600 mb-1">Diesen Monat gespart</p>
          <h2 class="text-5xl font-bold text-slate-900 tracking-tight">${formatMoney(data.monthTotal)}</h2>
          <div class="mt-4 flex items-center gap-2 text-sm text-green-700">
            <span class="material-symbols-outlined text-[18px]">trending_up</span>
            <span class="font-semibold">${escapeHtml(changeText)}</span>
          </div>
        </div>
        <div class="absolute -right-8 -bottom-16 w-32 h-32 rounded-full bg-primary/20 blur-2xl"></div>
      </section>

      <div class="flex items-center justify-between mb-4">
        <h3 class="text-3xl font-bold text-slate-900">Letzte Eintraege</h3>
      </div>

      <section class="flex flex-col gap-3">${entriesContent}</section>
    </main>
  `;
}

function renderChartBars(insights: InsightsSnapshot): string {
  const peak = Math.max(1, ...insights.series.map((point) => point.value));

  return insights.series
    .map((point) => {
      const heightPercent = point.value <= 0 ? 10 : Math.max(12, Math.round((point.value / peak) * 100));
      return `
        <div class="flex flex-col items-center gap-2 w-full h-full justify-end">
          <div class="w-full bg-primary/20 rounded-t-sm relative flex items-end" style="height:${heightPercent}%;">
            <div class="w-full bg-primary rounded-t-sm h-full opacity-90"></div>
          </div>
          <p class="text-slate-400 text-xs font-semibold">${escapeHtml(point.label)}</p>
        </div>
      `;
    })
    .join("");
}

export function renderInsightsScreen(data: InsightsScreenData): string {
  const { insights } = data;

  return `
    <header class="sticky top-0 z-10 bg-background-light/90 backdrop-blur-md border-b border-slate-200">
      <div class="flex items-center p-4 pb-3 justify-between">
        <button class="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 transition-colors" data-action="navigate" data-route="home">
          <span class="material-symbols-outlined !text-[24px]">arrow_back</span>
        </button>
        <h2 class="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Einblicke</h2>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto pb-36">
      <div class="flex flex-wrap gap-4 p-4">
        <section class="flex min-w-[158px] flex-1 flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-slate-500 text-sm font-medium">Gespart (Woche)</p>
            <span class="material-symbols-outlined text-primary text-sm">trending_up</span>
          </div>
          <p class="text-slate-900 tracking-tight text-4xl font-bold mt-1">${formatMoney(insights.weekTotal)}</p>
          <p class="text-primary text-sm font-medium bg-primary/10 w-fit px-2 py-0.5 rounded text-[12px]">${escapeHtml(formatChangeText(insights.weekChangePercent, "zur Vorwoche"))}</p>
        </section>

        <section class="flex min-w-[158px] flex-1 flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-slate-500 text-sm font-medium">Gespart (Monat)</p>
            <span class="material-symbols-outlined text-primary text-sm">calendar_month</span>
          </div>
          <p class="text-slate-900 tracking-tight text-4xl font-bold mt-1">${formatMoney(insights.monthTotal)}</p>
          <p class="text-primary text-sm font-medium bg-primary/10 w-fit px-2 py-0.5 rounded text-[12px]">${escapeHtml(formatChangeText(insights.monthChangePercent, "zum Vormonat"))}</p>
        </section>
      </div>

      <section class="px-4 py-2">
        <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div class="flex items-end justify-between mb-6">
            <div class="flex flex-col gap-1">
              <p class="text-slate-500 text-sm font-medium uppercase tracking-wider">Letzte 7 Tage</p>
              <p class="text-slate-900 tracking-tight text-5xl font-bold truncate">${formatMoney(insights.last7Total)}</p>
            </div>
            <div class="flex gap-1 items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span class="material-symbols-outlined text-primary text-sm">bar_chart</span>
              <p class="text-slate-600 text-xs font-semibold">Wochenansicht</p>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-3 h-56 items-end justify-items-center w-full">
            ${renderChartBars(insights)}
          </div>
        </div>
      </section>

      <section class="p-4 flex flex-col gap-3">
        ${renderStatRow("savings", "Durchschnitt pro Tag", formatMoney(insights.averageDailySaved))}
        ${renderStatRow("local_offer", "Top-Kategorie", insights.topCategory)}
        ${renderStatRow("flag", "Monatsprognose", formatMoney(insights.projectedMonthly))}
      </section>
    </main>
  `;
}

function renderTypeOption(type: EntryType, selectedType: EntryType): string {
  const checked = type === selectedType ? "checked" : "";
  return `
    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white has-[:checked]:shadow-sm transition-all duration-200 text-slate-500 has-[:checked]:text-slate-900 text-sm font-semibold leading-normal group">
      <span class="truncate">${escapeHtml(ENTRY_TYPE_META[type].label)}</span>
      <input ${checked} class="invisible w-0 absolute" name="type" type="radio" value="${type}" />
    </label>
  `;
}

export function renderEntrySheet(sheet: EntrySheetViewModel): string {
  if (!sheet.open) {
    return "";
  }

  const cheaperVisible = sheet.type === "cheaper";
  const amountVisible = !cheaperVisible;
  const amountLabel = sheet.type === "income" ? "Einkommensbetrag" : "Gesparter Betrag";
  const title = sheet.mode === "edit" ? "Eintrag bearbeiten" : "Sparen hinzufuegen";
  const buttonText = sheet.mode === "edit" ? "Aenderungen speichern" : "Eintrag speichern";

  return `
    <div class="fixed inset-0 z-50 flex flex-col justify-end items-stretch bg-black/40 backdrop-blur-sm" role="presentation">
      <button type="button" aria-label="Schliessen" data-action="close-sheet" class="absolute inset-0 z-0"></button>

      <section class="relative z-10 flex flex-col items-stretch bg-background-light rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.15)] ring-1 ring-white/10 max-w-md w-full mx-auto">
        <div class="flex h-8 w-full items-center justify-center pt-3 pb-1">
          <div class="h-1.5 w-12 rounded-full bg-slate-300"></div>
        </div>

        <div class="px-6 pb-4 pt-2 text-center relative">
          <h3 class="text-slate-900 tracking-tight text-3xl font-bold leading-tight">${title}</h3>
          <button type="button" class="absolute right-6 top-2 text-slate-400 hover:text-slate-600 transition-colors" data-action="close-sheet" aria-label="Schliessen">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form id="entry-sheet-form" class="pb-[calc(env(safe-area-inset-bottom)+24px)]">
          <input type="hidden" name="date" value="${escapeHtml(sheet.date)}" />

          <div class="px-6 pb-6 pt-2">
            <div class="flex h-12 w-full items-center justify-center rounded-xl bg-slate-200 p-1">
              ${renderTypeOption("avoid", sheet.type)}
              ${renderTypeOption("cheaper", sheet.type)}
              ${renderTypeOption("income", sheet.type)}
            </div>
          </div>

          <div class="flex flex-col px-6 pb-4 ${amountVisible ? "" : "hidden"}">
            <label class="flex flex-col w-full group">
              <p class="text-slate-500 text-sm font-medium mb-2 pl-1">${amountLabel}</p>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-slate-400 text-3xl font-semibold material-symbols-outlined">attach_money</span>
                <input
                  name="amount"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 bg-slate-100 border-0 focus:ring-2 focus:ring-primary/50 focus:bg-white h-20 pl-12 pr-4 text-4xl font-bold tracking-tight placeholder:text-slate-300 transition-all shadow-inner"
                  inputmode="decimal"
                  placeholder="0,00"
                  type="text"
                  autocomplete="off"
                  value="${escapeHtml(sheet.amount)}"
                />
              </div>
            </label>
          </div>

          <div class="px-6 pb-4 ${cheaperVisible ? "" : "hidden"}">
            <div class="grid gap-4">
              <label class="grid gap-2">
                <span class="text-sm font-medium text-slate-500">Referenzpreis</span>
                <input
                  name="referencePrice"
                  class="h-14 rounded-xl border-0 bg-slate-100 focus:ring-2 focus:ring-primary/50 px-4 text-lg font-semibold"
                  inputmode="decimal"
                  placeholder="0,00"
                  type="text"
                  autocomplete="off"
                  value="${escapeHtml(sheet.referencePrice)}"
                />
              </label>
              <label class="grid gap-2">
                <span class="text-sm font-medium text-slate-500">Bezahlt</span>
                <input
                  name="paidPrice"
                  class="h-14 rounded-xl border-0 bg-slate-100 focus:ring-2 focus:ring-primary/50 px-4 text-lg font-semibold"
                  inputmode="decimal"
                  placeholder="0,00"
                  type="text"
                  autocomplete="off"
                  value="${escapeHtml(sheet.paidPrice)}"
                />
              </label>
            </div>
          </div>

          <div class="flex flex-col px-6 pb-5">
            <label class="flex flex-col w-full group">
              <p class="text-slate-500 text-sm font-medium mb-2 pl-1">Notiz (optional)</p>
              <div class="relative">
                <input
                  name="note"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 bg-slate-100 border-0 focus:ring-2 focus:ring-primary/50 focus:bg-white h-14 pl-4 pr-10 text-base font-normal leading-normal placeholder:text-slate-400 transition-all"
                  placeholder="Kaffee, Impulskauf ..."
                  type="text"
                  maxlength="140"
                  value="${escapeHtml(sheet.note)}"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined pointer-events-none text-xl">edit_note</span>
              </div>
            </label>
          </div>

          <p class="px-6 pb-4 text-sm font-medium text-rose-600 min-h-[24px]">${escapeHtml(sheet.error)}</p>

          <div class="px-6 pb-6">
            <button type="submit" class="w-full h-14 flex items-center justify-center rounded-xl bg-primary text-slate-900 font-bold text-3xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:bg-green-400">
              ${buttonText}
            </button>
          </div>
        </form>
      </section>
    </div>
  `;
}
