import { useState } from 'react'

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
  rows: TxRow[]
  showScore?: boolean
  pageSize?: number
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

export default function TransactionsTable({ rows, showScore, pageSize = 25 }: Props) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(rows.length / pageSize)
  const slice = rows.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div>
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
            {slice.map((r) => (
              <tr key={r.id}>
                <td>{r.timestamp}</td>
                <td>{r.merchant}</td>
                <td>{r.category}</td>
                <td className="num">${r.amount.toFixed(2)}</td>
                <td>{r.location}</td>
                <td><Badge status={r.status} /></td>
                {showScore ? (
                  <td className="num">{r.score != null ? r.score.toFixed(3) : '—'}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="tablePager">
          <button className="btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
          <span className="pagerInfo">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rows.length)} of {rows.length.toLocaleString()}
          </span>
          <button className="btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next →</button>
        </div>
      )}
    </div>
  )
}
