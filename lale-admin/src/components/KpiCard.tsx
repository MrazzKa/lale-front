export function KpiCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="card">
      <div className="card-header">
        <h4>{title}</h4>
      </div>
      <div className="kpi">{value}</div>
      {hint ? <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>{hint}</div> : null}
    </div>
  );
}
