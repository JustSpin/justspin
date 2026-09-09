export type Clock = { dow: number; minutes: number };

const WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export function localClock(timeZone?: string | null, at = new Date()): Clock {
  if (!timeZone) {
    return { dow: at.getDay(), minutes: at.getHours() * 60 + at.getMinutes() };
  }
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(at);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    const wd = WEEK.findIndex((d) => d.startsWith(get("weekday").toLowerCase().slice(0, 3)));
    let hour = Number(get("hour"));
    const minute = Number(get("minute"));
    if (hour === 24) hour = 0;
    if (wd < 0 || !Number.isFinite(hour) || !Number.isFinite(minute)) {
      return { dow: at.getDay(), minutes: at.getHours() * 60 + at.getMinutes() };
    }
    return { dow: wd, minutes: hour * 60 + minute };
  } catch {
    return { dow: at.getDay(), minutes: at.getHours() * 60 + at.getMinutes() };
  }
}

export function isOpenAt(spec: string | null | undefined, clock: Clock): boolean | null {
  if (!spec) return null;
  const raw = spec.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower === "24/7") return true;
  if (lower === "closed" || lower === "off") return false;
  if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ph|sh|sunrise|sunset|week|year)\b/i.test(raw)) {
    return null;
  }
  if (raw.includes("||") || raw.includes("+") || raw.includes('"')) return null;

  const rules = raw.split(";").map((s) => s.trim()).filter(Boolean);
  if (!rules.length) return null;

  let today: { off: boolean; intervals: Array<{ start: number; end: number }> } | "none" = "none";
  for (const rule of rules) {
    const parsed = parseRule(rule);
    if (!parsed) return null;
    if (parsed.days.has(clock.dow)) {
      today = parsed.off ? { off: true, intervals: [] } : { off: false, intervals: parsed.intervals };
    }
  }
  if (today === "none") return false;
  if (today.off) return false;
  if (!today.intervals.length) return null;
  return today.intervals.some((iv) => contains(clock.minutes, iv.start, iv.end));
}

export function looksPermanentlyClosed(...parts: Array<string | null | undefined>): boolean {
  const blob = parts.filter(Boolean).join(" ").toLowerCase();
  return /permanently closed|closed permanently|out of business|\bdisused\b|\babandoned\b|\bshuttered\b|\(closed\)|former location|going out of business|coming soon|under construction|temporarily closed|closed for the season|closed for renovation|closed for good/.test(
    blob,
  );
}

export function compactHours(spec: string | null | undefined): string | null {
  if (!spec) return null;
  const s = spec.trim();
  if (s.length < 3 || s.length > 56) return null;
  if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ph|sunrise|sunset)\b/i.test(s)) return null;
  if (s === "closed" || s === "off") return null;
  return s;
}

function parseRule(rule: string): {
  days: Set<number>;
  off: boolean;
  intervals: Array<{ start: number; end: number }>;
} | null {
  const cleaned = rule.replace(/\s+/g, " ").trim();
  const match = cleaned.match(
    /^(?:([A-Za-z]{2}(?:-[A-Za-z]{2})?(?:\s*,\s*[A-Za-z]{2}(?:-[A-Za-z]{2})?)*)\s+)?(.+)$/,
  );
  if (!match) return null;
  const days = match[1] ? parseDays(match[1]) : allDays();
  if (!days) return null;
  const rest = match[2].trim().toLowerCase();
  if (rest === "off" || rest === "closed") return { days, off: true, intervals: [] };
  const intervals: Array<{ start: number; end: number }> = [];
  for (const chunk of rest.split(",")) {
    const iv = parseInterval(chunk.trim());
    if (!iv) return null;
    intervals.push(iv);
  }
  return { days, off: false, intervals };
}

function parseDays(chunk: string): Set<number> | null {
  const days = new Set<number>();
  const token = chunk.toLowerCase().replace(/\s+/g, "");
  for (const part of token.split(",")) {
    const [aRaw, bRaw] = part.split("-");
    const a = dayIndex(aRaw);
    if (a == null) return null;
    if (!bRaw) {
      days.add(a);
      continue;
    }
    const b = dayIndex(bRaw);
    if (b == null) return null;
    let i = a;
    days.add(i);
    let guard = 0;
    while (i !== b && guard++ < 8) {
      i = (i + 1) % 7;
      days.add(i);
    }
  }
  return days;
}

function dayIndex(raw: string | undefined): number | null {
  if (!raw) return null;
  const i = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(raw.slice(0, 2));
  return i >= 0 ? i : null;
}

function allDays() {
  return new Set([0, 1, 2, 3, 4, 5, 6]);
}

function parseInterval(chunk: string): { start: number; end: number } | null {
  const m = chunk.match(/^(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})$/);
  if (!m) return null;
  const start = parseTime(m[1]);
  const end = parseTime(m[2]);
  if (start == null || end == null || start === end) return null;
  return { start, end };
}

function parseTime(t: string): number | null {
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h === 24 && min === 0) return 1440;
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function contains(minutes: number, start: number, end: number): boolean {
  if (end < start) return minutes >= start || minutes < end;
  return minutes >= start && minutes < end;
}
