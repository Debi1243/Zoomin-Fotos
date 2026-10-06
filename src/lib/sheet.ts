/**
 * Calls the studio's Google Sheet web app (see dashboard-script.ts). Plain-text POSTs need no
 * preflight, so the sheet answers any page on the website.
 */
export type SheetReply<T> = T & { ok: boolean; error?: string; version?: number };

export async function callSheet<T = object>(endpoint: string, body: object): Promise<SheetReply<T>> {
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`The sheet answered ${res.status}`);
  return res.json();
}
