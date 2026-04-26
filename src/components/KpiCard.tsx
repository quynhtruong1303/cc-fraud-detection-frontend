type KpiCardProps = {
  label: string
  value: string
  hint?: string
}

export default function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <div className="card">
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
      {hint ? <div className="kpiHint">{hint}</div> : null}
    </div>
  )
}