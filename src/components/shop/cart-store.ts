"use client";

import { useSyncExternalStore } from "react";

/** One line in the cart: a product in one size or finish, and how many. */
export type CartLine = { id: string; option: string; qty: number };

const KEY = "zf-cart";
const EMPTY: CartLine[] = [];
let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine => typeof l?.id === "string" && typeof l?.option === "string" && Number.isInteger(l?.qty) && l.qty > 0,
    );
  } catch {
    return [];
  }
}

function getSnapshot() {
  if (lines === null) lines = read();
  return lines;
}

function set(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private windows or blocked storage: the cart still works until the page is closed.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    lines = read();
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** The visitor's cart, kept in this browser so it survives a reload or a visit to another page. */
export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export const cart = {
  add(id: string, option: string) {
    const all = getSnapshot();
    const found = all.find((l) => l.id === id && l.option === option);
    set(found ? all.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l)) : [...all, { id, option, qty: 1 }]);
  },
  setQty(id: string, option: string, qty: number) {
    const all = getSnapshot();
    set(qty <= 0 ? all.filter((l) => !(l.id === id && l.option === option)) : all.map((l) => (l.id === id && l.option === option ? { ...l, qty } : l)));
  },
  clear() {
    set([]);
  },
};
