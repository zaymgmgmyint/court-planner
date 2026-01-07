export default function FooterInfo() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-primary">Court Rates</h3>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="font-medium text-foreground">Weekdays</div>
          <div>07:00–16:00: 400 THB/hour</div>
          <div>16:00–23:00: 500 THB/hour</div>
          <div className="mt-4 font-medium text-foreground">Weekend</div>
          <div>07:00–23:00: 500 THB/hour</div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-primary">Contact</h3>
        <div className="mt-4 text-sm text-muted-foreground space-y-3">
          <div>
            <span className="text-muted-foreground/60">Phone:</span> <span className="ml-2 inline-block rounded bg-muted px-2 py-1 text-foreground">096 957 1555</span>
          </div>
          <div className="flex items-center gap-4">
            <a className="text-primary hover:underline" href="#" rel="noreferrer">Facebook</a>
            <a className="text-primary hover:underline" href="#" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-primary">Booking Types</h3>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <Legend color="#a855f7" label="Coach Booking" />
          <Legend color="#6366f1" label="Normal Group" />
        </div>
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors">
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: color }} />
      <span className="text-foreground">{label}</span>
    </div>
  );
}


