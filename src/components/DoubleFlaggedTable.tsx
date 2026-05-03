import { useState } from 'react'
import type { DoubleFlaggedRow } from '../api'

type Props = { data: DoubleFlaggedRow[]; pageSize?: number }

function MethodBadges({ row }: { row: DoubleFlaggedRow }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {row.flagged_by_category_dbscan && <span className="badge badgeWarn">Category</span>}
      {row.flagged_by_location_dbscan && <span className="badge badgeWarn">Location</span>}
      {row.flagged_by_amount_dbscan && <span className="badge badgeWarn">Amount</span>}
      <span className="badge badgeBad">LOF</span>
    </div>
  )
}

export default function DoubleFlaggedTable({ data, pageSize = 25 }: Props) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(data.length / pageSize)
  const slice = data.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Location</th>
              <th className="num">Amount</th>
              <th className="num">LOF Score</th>
              <th>Flagged by</th>
            </tr>
          </thead>
          <tbody>
            {slice.map(r => (
              <tr key={r.transaction_id}>
                <td>{r.trans_date_trans_time ? r.trans_date_trans_time.slice(0, 16) : '—'}</td>
                <td>{r.category}</td>
                <td>{r.city}, {r.state}</td>
                <td className="num">${Number(r.amt).toFixed(2)}</td>
                <td className="num">{Number(r.lof_score).toFixed(4)}</td>
                <td><MethodBadges row={r} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="tablePager">
          <button className="btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
          <span className="pagerInfo">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.length)} of {data.length.toLocaleString()}
          </span>
          <button className="btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next →</button>
        </div>
      )}
    </div>
  )
}
