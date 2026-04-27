export function KpiCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="card glass animate-fade-in card-hover">
      <div className="eyebrow no-margin">{title}</div>
      <div className="kpi">{value}</div>
      {hint ? <div className="muted small-text" style={{ marginTop: 8 }}>{hint}</div> : null}
    </div>
  );
}
