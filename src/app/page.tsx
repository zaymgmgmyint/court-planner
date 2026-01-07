"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Schedule from "@/components/Schedule";
import FooterInfo from "@/components/FooterInfo";
import { DaySchedule } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<string>("");
  const [data, setData] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(false);

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, []);

  const isoDate = dates[active].toISOString().slice(0, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/schedule?date=${isoDate}`, { cache: "no-store" });
    const json = (await res.json()) as DaySchedule;
    setData(json);
    setLoading(false);
    setLastRefresh(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [isoDate]);

  useEffect(() => {
    setMounted(true);
    fetchData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">The Challenge Tennis Booking Schedule</h1>
            <p className="text-sm text-muted-foreground mt-1">Schedule updated • Last refresh: {lastRefresh}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={fetchData} className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-60 transition-colors" disabled={loading}>
              {loading ? "Loading..." : "Reload"}
            </button>
          </div>
        </div>
        <div className="mt-6 flex gap-2 flex-wrap">
          {dates.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={
                "rounded-md px-3 py-2 text-sm border transition-colors " +
                (idx === active
                  ? "bg-primary/20 text-primary border-primary/50 font-medium"
                  : "text-muted-foreground border-border hover:bg-muted hover:text-foreground")
              }
            >
              {idx === 0 ? "Today" : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "2-digit" })}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {data ? <Schedule schedule={data} /> : <div className="text-muted-foreground">Loading schedule…</div>}
        </div>
        <FooterInfo />
      </div>
    </div>
  );
}
