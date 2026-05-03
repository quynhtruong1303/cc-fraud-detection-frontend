import type { AmountRow } from '../api'

const TIER_COLOR: Record<string, string> = {
  Low:       'badgeOk',
  Medium:    'badge',
  High:      'badgeWarn',
  'Very High': 'badgeBad',
}

type Props = { data: AmountRow[] }

export default function AmountTable({ data }: Props) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Amount range</th>
            <th>Risk tier</th>
            <th className="num">Fraud rate</th>
            <th className="num">Fraud txns</th>
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.amount_range}>
              <td>${r.amount_range}</td>
              <td>
                <span className={`badge ${TIER_COLOR[r.risk_tier] ?? 'badge'}`}>
                  {r.risk_tier}
                </span>
              </td>
              <td className="num">{(r.fraud_rate * 100).toFixed(2)}%</td>
              <td className="num">{Number(r.fraud_transactions).toLocaleString()}</td>
              <td className="num">{Number(r.total_transactions).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
