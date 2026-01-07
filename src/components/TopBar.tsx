"use client";

import { useState } from "react";

function dayLabel(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function TopBar() {
  // kept for future enhancement

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">
          The Challenge Tennis Booking Schedule
        </h1>
        <p className="text-sm text-white/60 mt-1">Schedule updated • Last refresh: 16:01</p>
      </div>
      <button className="rounded-md border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/5">
        Reload
      </button>
      <div className="hidden" />
    </div>
  );
}

export function DayTabs() {
  const [active, setActive] = useState(0);
  const offsets = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="mt-6 flex gap-2 flex-wrap">
      {offsets.map((o, idx) => (
        <button
          key={o}
          onClick={() => setActive(idx)}
          className={
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm border transition-colors " +
            (idx === active
              ? "bg-fuchsia-600/20 text-white border-fuchsia-600/50"
              : "text-white/80 border-white/10 hover:bg-white/5")
          }
        >
          <span className="i-ph:calendar"></span>
          {idx === 0 ? "Today" : dayLabel(o)}
        </button>
      ))}
    </div>
  );
}


