export type TxRow = {
  id: string
  timestamp: string
  merchant: string
  category: string
  amount: number
  location: string
  status: 'approved' | 'declined' | 'flagged'
  score?: number
}

type Props = {
  title?: string
  rows: TxRow[]
  showScore?: boolean
}

function Badge({ status }: { status: TxRow['status'] }) {
  const cls =
    status === 'approved'
      ? 'badge badgeOk'
      : status === 'declined'
      ? 'badge badgeBad'
      : 'badge badgeWarn'

  return <span className={cls}>{status}</span>
}

export default function TransactionsTable({ rows, showScore }: Props) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Category</th>
            <th className="num">Amount</th>
            <th>Location</th>
            <th>Status</th>
            {showScore ? <th className="num">Score</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.timestamp}</td>
              <td>{r.merchant}</td>
              <td>{r.category}</td>
              <td className="num">${r.amount.toFixed(2)}</td>
              <td>{r.location}</td>
              <td>
                <Badge status={r.status} />
              </td>
              {showScore ? (
                <td className="num">{r.score != null ? r.score.toFixed(3) : '—'}</td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}