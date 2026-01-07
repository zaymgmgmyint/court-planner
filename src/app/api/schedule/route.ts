import { NextRequest, NextResponse } from "next/server";
import { DaySchedule, CalendarEvent } from "@/lib/types";

function toIsoRangeUtc(dateIso: string) {
  const d = new Date(dateIso + "T00:00:00Z");
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59));
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

function toHHMM(date: Date): string {
  // Force time to be treated as Asia/Bangkok
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
    hour12: false,
  });
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
  const apiKey = process.env.GCAL_API_KEY;
  if (!apiKey) {
    console.error("Missing GCAL_API_KEY");
    return [];
  }
  const { timeMin, timeMax } = toIsoRangeUtc(date);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error(`Failed to fetch calendar ${courtId}: ${res.status} ${res.statusText}`);
      return [];
    }
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
  } catch (error) {
    console.error(`Error fetching calendar ${courtId}`, error);
    return [];
  }
}

import { z } from "zod";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Validate input
  const parseResult = querySchema.safeParse({
    date: searchParams.get("date") || undefined
  });

  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
  }

  // Use validated date or fallback to today
  const date = parseResult.data.date || new Date().toISOString().slice(0, 10);
  const events: CalendarEvent[] = [];

  try {
    const cal1 = process.env.GCAL_CAL_ID;
    const cal2 = process.env.GCAL_CAL2_ID;
    const cal3 = process.env.GCAL_CAL3_ID;

    if (!cal1 || !cal2 || !cal3) {
      console.error("Missing Calendar IDs in environment variables");
      // In production you might want to throw or return error, but for now we'll just log
    }

    // Only fetch if we have IDs
    const promises = [];
    if (cal1) promises.push(fetchFromGCal(cal1, 1, "#c084fc", date));
    if (cal2) promises.push(fetchFromGCal(cal2, 2, "#6366f1", date));
    if (cal3) promises.push(fetchFromGCal(cal3, 3, "#2ce080ff", date));

    const results = await Promise.all(promises);
    results.forEach(r => events.push(...r));
  } catch (err) {
    console.error("Error in schedule API handler:", err);
  }

  const body: DaySchedule = { date, events };
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}


