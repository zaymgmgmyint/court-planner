"use client";

import { useMemo } from "react";
import { DaySchedule } from "@/lib/types";

type Props = {
  schedule: DaySchedule;
};

const HOURS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":" ).map((v) => parseInt(v, 10));
  return h * 60 + m;
}

function formatRange(start: string, end: string): string {
  return `${start} - ${end}`;
}

function formatDurationMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) return "";
  const hours = totalMinutes / 60;
  const roundedHalf = Math.round(hours * 2) / 2;
  return `${roundedHalf}h`;
}

export default function Schedule({ schedule }: Props) {
  // Compute whether the rendered date is "today" (local) and current minute from start of view
  const isToday = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return schedule.date === todayIso;
  }, [schedule.date]);

  const nowOffsetMin = useMemo(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const startMin = timeToMinutes(HOURS[0]);
    return Math.max(0, minutes - startMin);
  }, []);

  const courts = useMemo(() => [
    { id: 1 as const, name: "Court 1" },
    { id: 2 as const, name: "Court 2" },
    { id: 3 as const, name: "Court 3" },
  ], []);

  const eventsByCourt = useMemo(() => {
    const map = new Map<number, typeof schedule.events>();
    courts.forEach((c) => map.set(c.id, []));
    schedule.events.forEach((e) => {
      map.get(e.courtId)?.push(e);
    });
    return map;
  }, [schedule, courts]);

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0f14]">
        <div className="grid grid-cols-[96px_repeat(3,minmax(0,1fr))]">
          <Header courts={courts} />
          <div className="col-span-4 grid grid-cols-subgrid">
            <div className="relative">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="h-16 border-b border-white/5 text-xs text-white/60 flex items-start pt-3 pl-4"
                >
                  {h}
                </div>
              ))}
            </div>

            {courts.map((court) => (
              <div key={court.id} className="relative">
                {HOURS.map((h) => (
                  <div key={h} className="h-16 border-l border-b border-white/5 overflow-hidden" />
                ))}
                {/* Past time dim overlay for today */}
                {isToday && (
                  <div
                    className="absolute left-0 right-0 bg-white/5 pointer-events-none"
                    style={{ top: 0, height: Math.min(nowOffsetMin, (timeToMinutes(HOURS[HOURS.length - 1]) - timeToMinutes(HOURS[0])) ) / 60 * 64 }}
                  />
                )}
                <div className="absolute inset-0">
                  {eventsByCourt.get(court.id)?.map((ev) => {
                    const topMin = timeToMinutes(ev.startTime) - timeToMinutes(HOURS[0]);
                    const endMin = timeToMinutes(ev.endTime) - timeToMinutes(HOURS[0]);
                    const heightMin = Math.max(0, endMin - topMin);
                    const top = (topMin / 60) * 64;
                    const height = (heightMin / 60) * 64;
                    const durationText = formatDurationMinutes(timeToMinutes(ev.endTime) - timeToMinutes(ev.startTime));
                    const eventEndAbsMin = timeToMinutes(ev.endTime);
                    const nowAbsMin = new Date().getHours() * 60 + new Date().getMinutes();
                    const isPastEvent = isToday && eventEndAbsMin <= nowAbsMin;
                    return (
                      <div
                        key={ev.id}
                        className={"absolute left-2 right-2 rounded-lg text-sm text-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] overflow-hidden " + (isPastEvent ? "opacity-50 saturate-50" : "")}
                        style={{ top, height, backgroundColor: ev.colorHex }}
                      >
                        <div className="px-3 py-2">
                          <div className="font-medium truncate" title={ev.title}>{ev.title}</div>
                          <div className="text-xs opacity-90 whitespace-nowrap">
                            {formatRange(ev.startTime, ev.endTime)}
                            {durationText ? ` • ${durationText}` : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ courts }: { courts: { id: 1 | 2 | 3; name: string }[] }) {
  return (
    <>
      <div className="h-12 flex items-center pl-4 text-sm text-white/60 bg-[#0f1218] border-b border-white/10">
        Time
      </div>
      {courts.map((c) => (
        <div
          key={c.id}
          className="h-12 flex items-center px-4 text-sm font-medium text-white bg-[#0f1218] border-b border-l border-white/10"
        >
          {c.name}
        </div>
      ))}
    </>
  );
}


