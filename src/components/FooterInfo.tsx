export default function FooterInfo() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-fuchsia-300">Court Rates</h3>
        <div className="mt-4 space-y-2 text-sm text-white/80">
          <div className="font-medium text-white/90">Weekdays</div>
          <div>07:00–16:00: 400 THB/hour</div>
          <div>16:00–23:00: 500 THB/hour</div>
          <div className="mt-4 font-medium text-white/90">Weekend</div>
          <div>07:00–23:00: 500 THB/hour</div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-fuchsia-300">Contact</h3>
        <div className="mt-4 text-sm text-white/80 space-y-3">
          <div>
            <span className="text-white/60">Phone:</span> <span className="ml-2 inline-block rounded bg-white/10 px-2 py-1">096 957 1555</span>
          </div>
          <div className="flex items-center gap-4">
            <a className="text-indigo-300 hover:underline" href="#" rel="noreferrer">Facebook</a>
            <a className="text-indigo-300 hover:underline" href="#" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-fuchsia-300">Booking Types</h3>
        <div className="mt-4 space-y-3 text-sm text-white/80">
          <Legend color="#c084fc" label="Coach Booking" />
          <Legend color="#6366f1" label="Normal Group" />
        </div>
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0f14] p-5">
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}


