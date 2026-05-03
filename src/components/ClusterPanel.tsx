import type { ClusterRow } from '../api'

type Props = { data: ClusterRow[]; dimension: string }

export default function ClusterPanel({ data, dimension }: Props) {
  const grouped = data.reduce<Record<number, ClusterRow[]>>((acc, row) => {
    ;(acc[row.cluster_assignment] ??= []).push(row)
    return acc
  }, {})

  const assignments = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {assignments.map(assignment => {
        const rows = grouped[assignment]
        const isNoise = assignment === -1
        return (
          <div key={assignment}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--muted-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              {isNoise ? `Noise / Outliers (${dimension})` : `Cluster ${assignment}`}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {rows.map(r => (
                <span
                  key={r.label}
                  className={`badge ${isNoise ? 'badgeBad' : 'badgeOk'}`}
                  title={`Fraud rate: ${(r.fraud_rate * 100).toFixed(1)}% — ${r.total_transactions.toLocaleString()} txns`}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
