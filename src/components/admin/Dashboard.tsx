"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CircleAlert,
  Copy,
  ExternalLink,
  LoaderCircle,
  LogOut,
  Mail,
  MessageCircle,
  MousePointerClick,
  Phone,
  RefreshCw,
  Sheet,
  Smartphone,
  UsersRound,
  Eye,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import { explain, readStoredToken, remembered, SignIn, storeToken, type Notice } from "@/components/admin/auth";
import { commitChange, GitHubError, loadContent, verifyToken } from "@/lib/github";
import { DATA_ENDPOINT_PATTERN } from "@/lib/settings";
import { dashboardScript } from "@/lib/dashboard-script";
import { services } from "@/lib/data";
import { cn } from "@/lib/cn";

/** [time, type, path, label, target, referrer, device, visitor, session], as the sheet script returns them. */
type Row = [number, string, string, string, string, string, string, string, string];
type Enquiry = {
  id: string;
  received: number;
  status: string;
  session: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  location: string;
  message: string;
  page: string;
};
type Data = { events: Row[]; enquiries: Enquiry[]; sheetUrl: string; loadedAt: number };

const RANGES = [
  { days: 1, label: "Today" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];
const STATUSES = ["New", "Replied", "Booked", "Closed"] as const;
const DAY = 86_400_000;

const pageNames: Record<string, string> = {
  "/": "Home",
  "/portfolio": "Portfolio",
  "/services": "Services",
  "/about": "About",
  "/contact": "Contact",
  ...Object.fromEntries(services.map((s) => [`/services/${s.slug}`, s.title])),
};
const pageName = (path: string) => pageNames[path] ?? path;
const deviceNames: Record<string, string> = { ios: "iPhone and iPad", android: "Android", desktop: "Computer" };

async function callSheet<T>(endpoint: string, body: object): Promise<T & { ok: boolean; error?: string }> {
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`The sheet answered ${res.status}`);
  return res.json();
}

function tally<T>(items: T[], key: (item: T) => string | undefined) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const when = (t: number) => {
  const mins = Math.round((Date.now() - t) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 24 * 60) return `${Math.round(mins / 60)} h ago`;
  return new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const shootDate = (value: string) => {
  const t = Date.parse(value);
  return Number.isNaN(t) ? value : new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const whatsapp = (phone: string) => {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return digits.length >= 11 ? `https://wa.me/${digits}` : null;
};

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [endpoint, setEndpoint] = useState<string>("");
  const [setup, setSetup] = useState(false);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (key: string, remember: boolean) => {
    setChecking(true);
    setNotice(null);
    try {
      const { canSave } = await verifyToken(key);
      if (!canSave) throw new GitHubError("forbidden", 403);
      const { content } = await loadContent(key);
      storeToken(key, remember);
      setToken(key);
      setEndpoint(content.settings.dataEndpoint ?? "");
    } catch (err) {
      storeToken(null, false);
      setToken(null);
      setNotice({ kind: "error", text: explain(err) });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const saved = readStoredToken();
    // Restoring a saved session reads browser storage and talks to GitHub, so it waits for mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) void signIn(saved, remembered());
    else setChecking(false);
  }, [signIn]);

  const load = useCallback(async () => {
    if (!token || !endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const result = await callSheet<Omit<Data, "loadedAt">>(endpoint, { type: "read", token, days });
      if (!result.ok) throw new Error(result.error === "not-allowed" ? "The sheet did not accept your access key." : (result.error ?? "The sheet sent an error."));
      setData({ ...result, loadedAt: Date.now() });
    } catch (err) {
      setError(`${explain(err)} If you redeployed the script, check it is set to run for anyone.`);
    } finally {
      setLoading(false);
    }
  }, [token, endpoint, days]);

  useEffect(() => {
    // Fetching from the studio's sheet is a side effect of the range or sign-in changing.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function setStatus(enquiry: Enquiry, status: string) {
    if (!token || !endpoint || !data) return;
    const before = data;
    setData({ ...data, enquiries: data.enquiries.map((q) => (q.id === enquiry.id ? { ...q, status } : q)) });
    try {
      const result = await callSheet(endpoint, { type: "status", token, id: enquiry.id, status });
      if (!result.ok) throw new Error(result.error);
    } catch {
      setData(before);
      setError("That status change did not save. Please try again.");
    }
  }

  if (checking) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Checking your sign-in…
      </p>
    );
  }
  if (!token) return <SignIn onSignIn={signIn} notice={notice} />;

  const signOut = () => {
    storeToken(null, false);
    setToken(null);
    setData(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        {endpoint && !setup ? (
          <div role="group" aria-label="Time range" className="flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <button
                key={r.days}
                type="button"
                aria-pressed={days === r.days}
                onClick={() => setDays(r.days)}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm transition-colors",
                  days === r.days ? "border-fg bg-fg text-bg" : "border-border hover:border-border-strong",
                )}
              >
                {r.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:text-fg"
            >
              <RefreshCw aria-hidden className={cn("size-4", loading && "animate-spin")} /> Refresh
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted">One-time setup, about five minutes.</p>
        )}
        <button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
          <LogOut aria-hidden className="size-4" /> Sign out
        </button>
      </div>

      {!endpoint || setup ? (
        <Setup
          token={token}
          current={endpoint}
          onCancel={endpoint ? () => setSetup(false) : undefined}
          onSaved={(url) => {
            setEndpoint(url);
            setSetup(false);
          }}
        />
      ) : (
        <>
          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-md border border-error/40 p-4 text-sm text-error">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> {error}
            </p>
          )}
          {!data && loading && (
            <p className="flex items-center gap-2 text-muted" role="status">
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading your numbers…
            </p>
          )}
          {data && <Overview data={data} days={days} onStatus={setStatus} />}
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted">
            {data?.sheetUrl && (
              <a href={data.sheetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-fg">
                <Sheet aria-hidden className="size-4" /> Open the Google Sheet
              </a>
            )}
            <button type="button" onClick={() => setSetup(true)} className="hover:text-fg">
              Connect a different sheet
            </button>
            <span>Visits from devices you sign in on are not counted.</span>
          </div>
        </>
      )}
    </div>
  );
}

function Overview({ data, days, onStatus }: { data: Data; days: number; onStatus: (q: Enquiry, status: string) => void }) {
  const [filter, setFilter] = useState<"all" | "new">("all");
  const now = data.loadedAt;
  const since = startOfDay(now - (days - 1) * DAY);

  const stats = useMemo(() => {
    const events = data.events.filter((e) => e[0] >= since);
    const views = events.filter((e) => e[1] === "view");
    const clicks = events.filter((e) => e[1] === "click");
    const visitors = new Set(views.map((e) => e[7]));
    const sessions = new Map<string, Row>();
    for (const v of [...views].sort((a, b) => a[0] - b[0])) if (!sessions.has(v[8])) sessions.set(v[8], v);
    const firstVisit = new Map<string, Row>();
    for (const v of views) firstVisit.set(v[7], v);

    const perDay = new Map<number, number>();
    for (const v of views) perDay.set(startOfDay(v[0]), (perDay.get(startOfDay(v[0])) ?? 0) + 1);
    const daysList = Array.from({ length: days }, (_, i) => startOfDay(now - (days - 1 - i) * DAY)).map((d) => ({
      day: d,
      count: perDay.get(d) ?? 0,
    }));

    return {
      views: views.length,
      visitors: visitors.size,
      clicks: clicks.length,
      enquiries: data.enquiries.filter((q) => q.received >= since).length,
      daily: daysList,
      pages: tally(views, (e) => pageName(e[2])),
      clicked: tally(clicks, (e) => `${e[3]}\u0000${e[4]}`).map(([k, n]) => {
        const [label, target] = k.split("\u0000");
        return { label, target, n };
      }),
      devices: tally([...firstVisit.values()], (e) => deviceNames[e[6]] ?? "Other"),
      sources: tally([...sessions.values()], (e) => e[5] || "Direct or unknown"),
    };
  }, [data, days, since, now]);

  const newCount = data.enquiries.filter((q) => q.status === "New").length;
  const enquiries = filter === "new" ? data.enquiries.filter((q) => q.status === "New") : data.enquiries;

  return (
    <div className="space-y-10">
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<Inbox className="size-5" />} label="Enquiries" value={stats.enquiries} note={newCount ? `${newCount} waiting for a reply` : "All answered"} />
        <Stat icon={<Eye className="size-5" />} label="Page visits" value={stats.views} />
        <Stat icon={<UsersRound className="size-5" />} label="Visitors" value={stats.visitors} note="Different people" />
        <Stat icon={<MousePointerClick className="size-5" />} label="Clicks" value={stats.clicks} />
      </ul>

      {days > 1 && <DailyChart daily={stats.daily} />}

      <section aria-labelledby="enquiries-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="enquiries-title" className="font-display text-h3">
            Enquiries
          </h2>
          <div role="group" aria-label="Show enquiries" className="flex gap-2">
            {(["all", "new"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm transition-colors",
                  filter === f ? "border-fg bg-fg text-bg" : "border-border hover:border-border-strong",
                )}
              >
                {f === "all" ? `All ${data.enquiries.length}` : `New ${newCount}`}
              </button>
            ))}
          </div>
        </div>
        {enquiries.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            {data.enquiries.length === 0 ? "No enquiries yet. Everything sent from the contact page will appear here." : "Nothing new. Every enquiry has a status."}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {enquiries.map((q) => (
              <EnquiryCard key={q.id} q={q} onStatus={onStatus} />
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Ranked title="Most visited pages" rows={stats.pages.map(([label, n]) => ({ label, n }))} empty="No visits in this range yet." />
        <Ranked
          title="Most clicked"
          rows={stats.clicked.map((c) => ({ label: c.label, sub: c.target, n: c.n }))}
          empty="No clicks in this range yet."
        />
        <Ranked title="Devices" icon={<Smartphone className="size-4" />} rows={stats.devices.map(([label, n]) => ({ label, n }))} empty="No visitors yet." percent />
        <Ranked title="Where visitors came from" rows={stats.sources.map(([label, n]) => ({ label, n }))} empty="No visits yet." percent />
      </div>
    </div>
  );
}

function Stat({ icon, label, value, note }: { icon: ReactNode; label: string; value: number; note?: string }) {
  return (
    <li className="rounded-lg border border-border bg-surface p-5">
      <p className="flex items-center gap-2 text-sm text-muted">
        <span aria-hidden>{icon}</span> {label}
      </p>
      <p className="tabular mt-3 font-display text-4xl leading-none">{value.toLocaleString("en-IN")}</p>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </li>
  );
}

function DailyChart({ daily }: { daily: { day: number; count: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  const fmt = (t: number) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <section aria-labelledby="daily-title" className="rounded-lg border border-border bg-surface p-5">
      <h2 id="daily-title" className="text-sm text-muted">
        Page visits per day
      </h2>
      <div className="mt-5 flex h-40 items-end gap-[2px]" role="img" aria-label={`Daily page visits, highest ${max}`}>
        {daily.map((d) => (
          <div key={d.day} className="group relative flex h-full flex-1 items-end" title={`${fmt(d.day)}: ${d.count}`}>
            <div
              className="festive-gradient w-full rounded-t-[3px] transition-opacity group-hover:opacity-80"
              style={{ height: d.count ? `${Math.max(4, (d.count / max) * 100)}%` : "2px", opacity: d.count ? 1 : 0.25 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{fmt(daily[0].day)}</span>
        <span>Today</span>
      </div>
    </section>
  );
}

function Ranked({
  title,
  rows,
  empty,
  percent,
  icon,
}: {
  title: string;
  rows: { label: string; sub?: string; n: number }[];
  empty: string;
  percent?: boolean;
  icon?: ReactNode;
}) {
  const total = rows.reduce((s, r) => s + r.n, 0);
  const max = rows[0]?.n ?? 1;
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <h2 className="flex items-center gap-2 text-sm text-muted">
        {icon && <span aria-hidden>{icon}</span>}
        {title}
      </h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{empty}</p>
      ) : (
        <ol className="mt-4 space-y-2.5">
          {rows.slice(0, 8).map((r) => (
            <li key={`${r.label}-${r.sub}`} className="relative">
              <div aria-hidden className="absolute inset-y-0 left-0 rounded-sm bg-fg/[0.06]" style={{ width: `${(r.n / max) * 100}%` }} />
              <div className="relative flex items-baseline justify-between gap-4 px-2 py-1.5 text-sm">
                <span className="min-w-0 truncate">
                  {r.label}
                  {r.sub && <span className="ml-2 text-xs text-muted">{r.sub}</span>}
                </span>
                <span className="tabular shrink-0">{percent ? `${Math.round((r.n / total) * 100)}%` : r.n.toLocaleString("en-IN")}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function EnquiryCard({ q, onStatus }: { q: Enquiry; onStatus: (q: Enquiry, status: string) => void }) {
  const wa = whatsapp(q.phone);
  const action = "inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm transition-colors hover:border-fg";
  return (
    <li className={cn("rounded-lg border bg-surface p-5", q.status === "New" ? "border-border-strong" : "border-border")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex flex-wrap items-center gap-2">
            {q.status === "New" && <span aria-hidden className="festive-gradient size-2 rounded-full" />}
            <span className="font-medium">{q.name}</span>
            {q.session && <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">{q.session}</span>}
          </p>
          <p className="mt-1 text-sm text-muted" title={new Date(q.received).toLocaleString("en-IN")}>
            {when(q.received)}
            {q.date && <> · Shoot date {shootDate(q.date)}</>}
            {q.location && <> · {q.location}</>}
          </p>
        </div>
        <label className="text-sm">
          <span className="sr-only">Status for {q.name}</span>
          <select
            value={q.status}
            onChange={(e) => onStatus(q, e.target.value)}
            className="h-9 rounded-md border border-border bg-bg px-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{q.message}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a className={action} href={`mailto:${q.email}?subject=${encodeURIComponent(`Your ${q.session ? `${q.session.toLowerCase()} ` : ""}enquiry with Zoomin Fotos`)}`}>
          <Mail aria-hidden className="size-4" /> {q.email}
        </a>
        {q.phone && (
          <a className={action} href={`tel:${q.phone.replace(/[^\d+]/g, "")}`}>
            <Phone aria-hidden className="size-4" /> {q.phone}
          </a>
        )}
        {wa && (
          <a className={action} href={wa} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden className="size-4" /> WhatsApp
          </a>
        )}
      </div>
    </li>
  );
}

function Setup({ token, current, onSaved, onCancel }: { token: string; current: string; onSaved: (url: string) => void; onCancel?: () => void }) {
  const [url, setUrl] = useState(current);
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<{ busy?: string; error?: string }>({});

  async function copy() {
    try {
      await navigator.clipboard.writeText(dashboardScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setState({ error: "Copying was blocked. Select the code in the box below and copy it by hand." });
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const address = url.trim();
    if (!DATA_ENDPOINT_PATTERN.test(address)) {
      setState({ error: "Paste the Web app URL Google showed after deploying. It starts with https://script.google.com/macros/s/ and ends in /exec." });
      return;
    }
    setState({ busy: "Checking the sheet…" });
    try {
      const test = await callSheet(address, { type: "read", token, days: 1 });
      if (!test.ok) throw new Error(test.error === "not-allowed" ? "The sheet could not confirm your access key with GitHub." : test.error);
    } catch (err) {
      setState({
        error: `${explain(err)} Make sure "Who has access" is set to Anyone, and that you clicked Authorize when Google asked.`,
      });
      return;
    }
    setState({ busy: "Connecting the website…" });
    try {
      await commitChange(token, (c) => ({ content: { settings: { ...c.settings, dataEndpoint: address } }, message: "Connect the studio dashboard sheet" }));
      onSaved(address);
    } catch (err) {
      setState({ error: explain(err) });
    }
  }

  const step = "flex gap-4";
  const num = "grid size-7 shrink-0 place-items-center rounded-full bg-fg text-xs font-medium text-bg";
  return (
    <section aria-labelledby="setup-title" className="max-w-3xl">
      <h2 id="setup-title" className="font-display text-h3">
        Connect a Google Sheet
      </h2>
      <p className="mt-2 text-sm text-muted">
        Your visits and enquiries are kept in a Google Sheet you own. Each new enquiry is also emailed to you. Do this once, on a computer.
      </p>
      <ol className="mt-8 space-y-6 text-sm leading-relaxed">
        <li className={step}>
          <span className={num}>1</span>
          <p>
            Open{" "}
            <a href="https://sheets.new" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium underline underline-offset-2">
              a new Google Sheet <ExternalLink aria-hidden className="size-3.5" />
            </a>{" "}
            while signed in to the studio&apos;s Google account, and name it “Zoomin Fotos dashboard”.
          </p>
        </li>
        <li className={step}>
          <span className={num}>2</span>
          <div className="min-w-0 flex-1">
            <p>
              Choose <b>Extensions › Apps Script</b>. Delete the code that is there, paste this code instead, and click the save icon.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => void copy()}>
                <Copy aria-hidden className="size-4" /> {copied ? "Copied" : "Copy the code"}
              </Button>
            </div>
            <textarea
              readOnly
              value={dashboardScript}
              aria-label="Dashboard script"
              onFocus={(e) => e.currentTarget.select()}
              className="mt-3 h-32 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"
            />
          </div>
        </li>
        <li className={step}>
          <span className={num}>3</span>
          <p>
            Click <b>Deploy › New deployment</b>, choose the type <b>Web app</b>, set <b>Execute as</b> to Me and <b>Who has access</b> to{" "}
            <b>Anyone</b>, then click Deploy. Google asks you to authorise it: choose your account, then <b>Advanced › Go to project</b> and{" "}
            <b>Allow</b>. This lets it save to your sheet and email you.
          </p>
        </li>
        <li className={step}>
          <span className={num}>4</span>
          <form onSubmit={save} className="min-w-0 flex-1 space-y-4">
            <TextField
              id="sheet-url"
              label="Copy the Web app URL Google shows and paste it here"
              value={url}
              placeholder="https://script.google.com/macros/s/…/exec"
              onChange={(e) => setUrl(e.target.value)}
              error={state.error}
              required
            />
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" loading={!!state.busy} loadingLabel={state.busy ?? "Saving…"}>
                Connect
              </Button>
              {onCancel && (
                <button type="button" onClick={onCancel} className="text-sm text-muted hover:text-fg">
                  Cancel
                </button>
              )}
            </div>
            <p className="text-muted">After connecting, the website starts counting visits and saving enquiries within about two minutes.</p>
          </form>
        </li>
      </ol>
    </section>
  );
}
