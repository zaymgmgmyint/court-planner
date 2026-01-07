"use client";

import { useMemo, useState } from "react";
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
  const [h, m] = t.split(":").map((v) => parseInt(v, 10));
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
  const [selectedEvent, setSelectedEvent] = useState<(DaySchedule['events'][0] & { courtName: string }) | null>(null);

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
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0f14]">
        <div className="grid" style={{ gridTemplateColumns: "96px 1fr 1fr 1fr" }}>
          {/* Header Row */}
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

          {/* Time Column */}
          <div className="relative border-r border-white/5">
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-16 border-b border-white/5 text-xs text-white/60 flex items-start pt-3 pl-4"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Court Columns */}
          {courts.map((court) => (
            <div key={court.id} className="relative border-r border-white/10 last:border-r-0">
              {HOURS.map((h) => (
                <div key={h} className="h-16 border-b border-white/5 overflow-hidden" />
              ))}
              {/* Past time dim overlay for today */}
              {isToday && (
                <div
                  className="absolute left-0 right-0 bg-white/5 pointer-events-none"
                  style={{ top: 0, height: Math.min(nowOffsetMin, (timeToMinutes(HOURS[HOURS.length - 1]) - timeToMinutes(HOURS[0]))) / 60 * 64 }}
                />
              )}
              {/* Events Layer */}
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
                      onClick={() => setSelectedEvent({ ...ev, courtName: court.name })}
                      className={"absolute left-2 right-2 rounded-lg text-sm text-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] overflow-hidden cursor-pointer hover:scale-[1.02] hover:brightness-110 active:scale-95 transition-all z-10 " + (isPastEvent ? "opacity-50 saturate-50" : "")}
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
  );
}

function EventDetailsModal({
  event,
  onClose
}: {
  event: DaySchedule['events'][0] & { courtName: string };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        className="relative w-full max-w-sm bg-[#1a1d24] border border-white/10 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1f232b]">
          <h3 className="text-lg font-semibold text-white">
            Event Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Title</label>
            <div className="text-lg text-white font-medium leading-normal">{event.title}</div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Start Time</label>
              <div className="text-base text-white/90 font-mono bg-white/5 px-2 py-1 rounded inline-block">{event.startTime}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">End Time</label>
              <div className="text-base text-white/90 font-mono bg-white/5 px-2 py-1 rounded inline-block">{event.endTime}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Duration</label>
              <div className="text-base text-white">
                {formatDurationMinutes(timeToMinutes(event.endTime) - timeToMinutes(event.startTime))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Court</label>
              <div className="text-base text-white">{event.courtName}</div>
            </div>
          </div>

          <div className="pt-2">
            <div
              className="h-3 rounded-full w-full opacity-90 shadow-sm"
              style={{ backgroundColor: event.colorHex }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}




