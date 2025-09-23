import { NextRequest, NextResponse } from "next/server";
import { DaySchedule, CalendarEvent } from "@/lib/types";

function toIsoRangeUtc(dateIso: string) {
  const d = new Date(dateIso + "T00:00:00Z");
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59));
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

function toHHMM(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

type GCalEvent = {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
};

function pickColorFromDescription(description?: string): string {
  const text = (description || "").toLowerCase();
  if (text.includes("coach booking")) return "#c084fc"; // pink
  if (text.includes("normal group")) return "#6366f1"; // blue
  return "#6366f1"; // default blue
}

async function fetchFromGCal(calendarId: string, courtId: 1 | 2 | 3, fallbackColorHex: string, date: string): Promise<CalendarEvent[]> {
  const apiKey = process.env.GCAL_API_KEY || "AIzaSyDr-o9IKvS2grpyt7-fOCqUaX5y4Qmzo3g";
  const { timeMin, timeMax } = toIsoRangeUtc(date);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const data: { items?: GCalEvent[] } = await res.json();
  const items: GCalEvent[] = data.items || [];
  return items.map((event: GCalEvent) => {
    const isAllDay = !!event.start?.date;
    const startStr = event.start?.dateTime ?? event.start?.date;
    const endStr = event.end?.dateTime ?? event.end?.date;
    const start = isAllDay || !startStr ? new Date(date + "T00:00:00") : new Date(startStr);
    const end = isAllDay || !endStr ? new Date(date + "T23:59:00") : new Date(endStr);
    const title: string = event.summary || "(No title)";
    const color = pickColorFromDescription(event.description) || fallbackColorHex;
    return {
      id: event.id || `${date}-court${courtId}-${start.toISOString()}`,
      title,
      courtId,
      startTime: isAllDay ? "00:00" : toHHMM(start),
      endTime: isAllDay ? "23:59" : toHHMM(end),
      colorHex: color || fallbackColorHex,
    } as CalendarEvent;
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const events: CalendarEvent[] = [];
  try {
    const cal1 = process.env.GCAL_CAL_ID || "618f350cbd59c61bea551925e2cb9d98c80b8057675b8680b1c73c87231ef444@group.calendar.google.com";
    const cal2 = process.env.GCAL_CAL2_ID || "375d7745082c6185c83e1397663be44377a2b63711109912b5fc0e917552beb0@group.calendar.google.com";
    const cal3 = process.env.GCAL_CAL3_ID || "914ee816ec93414a27b64c9f99e4930a15236abdfb118c539bdd499bb2bb5591@group.calendar.google.com";
    const [c1, c2, c3] = await Promise.all([
      fetchFromGCal(cal1, 1, "#c084fc", date),
      fetchFromGCal(cal2, 2, "#6366f1", date),
      fetchFromGCal(cal3, 3, "#c084fc", date),
    ]);
    events.push(...c1, ...c2, ...c3);
  } catch {}

  const body: DaySchedule = { date, events };
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}


