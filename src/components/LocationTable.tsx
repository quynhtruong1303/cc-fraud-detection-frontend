import type { LocationRow } from '../api'

type Props = { data: LocationRow[] }

export default function LocationTable({ data }: Props) {
  const top15 = data.slice(0, 15)
  const maxRate = Math.max(...top15.map(r => r.fraud_rate))

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>City</th>
            <th>State</th>
            <th className="num">Fraud rate</th>
            <th className="num">Fraud txns</th>
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {top15.map(r => {
            const barPct = maxRate > 0 ? (r.fraud_rate / maxRate) * 100 : 0
            return (
              <tr key={`${r.state}-${r.city}`}>
                <td>{r.city}</td>
                <td>{r.state}</td>
                <td className="num">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <div style={{ width: 64, height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${barPct}%`, height: '100%', background: 'rgba(239,68,68,0.6)', borderRadius: 3 }} />
                    </div>
                    {(r.fraud_rate * 100).toFixed(2)}%
                  </div>
                </td>
                <td className="num">{Number(r.fraud_transactions).toLocaleString()}</td>
                <td className="num">{Number(r.total_transactions).toLocaleString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
