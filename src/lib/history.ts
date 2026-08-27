// @ts-nocheck
import type { VideoItem } from "./default-videos";

const KEY = "your_lessons_history_v1";
const MAX = 50;

export type HistoryItem = VideoItem & { watchedAt: number };

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: VideoItem): void {
  if (typeof window === "undefined") return;
  const existing = getHistory().filter((v) => v.id !== item.id);
  const next: HistoryItem[] = [{ ...item, watchedAt: Date.now() }, ...existing].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("history-updated"));
  } catch {
    // ignore
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("history-updated"));
}