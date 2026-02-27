import {
  formatCurrency,
  formatSignedCurrency,
  getEntryDateText,
  getEntryDisplayTitle,
  getEntryTypeLabel
} from "../models/entry";
import { ENTRY_TYPE_META, type Entry, type EntryType, type Route } from "../models/types";

export function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTypeIcon(type: EntryType): string {
  const meta = ENTRY_TYPE_META[type];
  return `
    <div class="w-12 h-12 rounded-full ${meta.toneClassName} flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined">${meta.icon}</span>
    </div>
  `;
}

export function renderEntryRow(entry: Entry, withActions: boolean): string {
  return `
    <article class="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/50 transition-all duration-200">
      <div class="flex items-center gap-4 min-w-0">
        ${renderTypeIcon(entry.type)}
        <div class="min-w-0">
          <h4 class="font-semibold text-slate-900 leading-tight mb-0.5 truncate">${escapeHtml(getEntryDisplayTitle(entry))}</h4>
          <p class="text-xs text-slate-500 font-medium">${escapeHtml(getEntryDateText(entry))} · ${escapeHtml(getEntryTypeLabel(entry.type))}</p>
        </div>
      </div>
      <div class="text-right shrink-0 pl-3">
        <span class="block font-bold text-primary text-lg">${formatSignedCurrency(entry.potential)}</span>
        ${
          withActions
            ? `<div class="mt-1 flex items-center justify-end gap-2">
                <button data-action="edit-entry" data-entry-id="${entry.id}" class="text-xs font-semibold text-slate-600 hover:text-slate-900">Edit</button>
                <button data-action="delete-entry" data-entry-id="${entry.id}" class="text-xs font-semibold text-rose-600 hover:text-rose-700">Delete</button>
              </div>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderNavItem(route: Route, currentRoute: Route, icon: string, label: string): string {
  const active = route === currentRoute;

  return `
    <a href="#/${route}" data-action="navigate" data-route="${route}" class="flex flex-1 flex-col items-center gap-1 ${
      active ? "text-primary" : "text-slate-500 hover:text-primary"
    } transition-colors">
      <div class="h-6 flex items-center justify-center ${active ? "" : "group-hover:scale-110"}">
        <span class="material-symbols-outlined ${active ? "font-variation-settings-fill" : ""} text-[24px]">${icon}</span>
      </div>
      <span class="text-[11px] font-medium tracking-wide">${label}</span>
    </a>
  `;
}

export function renderBottomNav(currentRoute: Route): string {
  return `
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-slate-200 bg-white px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+18px)] z-30">
      <div class="flex items-center justify-between gap-4">
        ${renderNavItem("home", currentRoute, "home", "Home")}
        ${renderNavItem("entries", currentRoute, "list", "Entries")}
        ${renderNavItem("insights", currentRoute, "bar_chart", "Insights")}
      </div>
    </nav>
  `;
}

export function renderFab(): string {
  return `
    <div class="fixed bottom-24 right-6 z-40">
      <button
        type="button"
        data-action="open-sheet"
        class="group flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Add entry"
      >
        <span class="material-symbols-outlined text-white text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  `;
}

export function renderStatRow(icon: string, label: string, value: string): string {
  return `
    <div class="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="bg-slate-100 rounded-full p-2 text-slate-500">
          <span class="material-symbols-outlined text-[20px]">${icon}</span>
        </div>
        <p class="text-slate-500 text-sm font-medium">${escapeHtml(label)}</p>
      </div>
      <p class="text-slate-900 text-base font-semibold text-right">${escapeHtml(value)}</p>
    </div>
  `;
}

export function renderEmptyCard(message: string): string {
  return `
    <section class="p-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm">
      ${escapeHtml(message)}
    </section>
  `;
}

export function formatChangeText(change: number, suffix: string): string {
  const rounded = Math.round(change * 10) / 10;
  const sign = rounded >= 0 ? "+" : "";
  return `${sign}${rounded}% ${suffix}`;
}

export function formatTargetChip(targetAmount: number): string {
  return `Target: ${formatCurrency(targetAmount)}`;
}

export function formatMoney(amount: number): string {
  return formatCurrency(amount);
}
