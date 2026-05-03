import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Summary, CategoryRow, LocationRow, AmountRow, ClusterRow, FlaggedRow, DoubleFlaggedRow } from '../api'
import KpiCard from './KpiCard'
import Panel from './Panel'
import CategoryChart from './CategoryChart'
import LocationTable from './LocationTable'
import AmountTable from './AmountTable'
import ClusterPanel from './ClusterPanel'
import DoubleFlaggedTable from './DoubleFlaggedTable'
import TransactionsTable from './TransactionsTable'
import type { TxRow } from './TransactionsTable'

function fmt(n: number) {
  return n.toLocaleString()
}

function dollar(n: number) {
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function pct(r: number) {
  return (r * 100).toFixed(2) + '%'
}

function toTxRow(r: FlaggedRow): TxRow {
  return {
    id: r.trans_num,
    timestamp: r.trans_date_trans_time?.slice(0, 16) ?? '—',
    merchant: r.merchant ?? '—',
    category: r.category ?? '—',
    amount: Number(r.amt),
    location: r.city && r.state ? `${r.city}, ${r.state}` : '—',
    status: 'flagged',
    score: Number(r.lof_score),
  }
}

export default function InternalReport() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [amounts, setAmounts] = useState<AmountRow[]>([])
  const [clusters, setClusters] = useState<ClusterRow[]>([])
  const [flagged, setFlagged] = useState<FlaggedRow[]>([])
  const [doubleFlagged, setDoubleFlagged] = useState<DoubleFlaggedRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api.summary(),
      api.byCategory(),
      api.byLocation(),
      api.byAmount(),
      api.clusters('category'),
      api.flagged(),
      api.doubleFlagged(),
    ])
      .then(([s, c, l, a, cl, f, df]) => {
        setSummary(s)
        setCategories(c)
        setLocations(l)
        setAmounts(a)
        setClusters(cl)
        setFlagged(f)
        setDoubleFlagged(df)
      })
      .catch(e => setError(String(e)))
  }, [])

  return (
    <div className="page">
      <header className="reportHeader">
        <div>
          <h1 className="title">Credit Card Fraud Detection — Internal Report</h1>
          <p className="subtitle">Live data from Supabase. LOF + DBSCAN analysis.</p>
          <div className="metaRow">
            <span className="metaPill">Dataset: transactions_detailed (14k rows)</span>
            <span className="metaPill">Audience: Fraud analytics team</span>
            {summary && (
              <span className="metaPill">
                Updated: {new Date(summary.computed_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="callout" style={{ marginTop: 12 }}>
          <div className="calloutTitle">API error</div>
          <div className="calloutText">{error}</div>
        </div>
      )}

      {/* 1) Executive Summary */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Executive Summary</h2>
          <p className="sectionDesc">High-level view for ops and triage.</p>
        </div>
        <div className="kpis">
          <KpiCard
            label="Total Transactions"
            value={summary ? fmt(summary.total_transactions) : '—'}
            hint="transactions_detailed"
          />
          <KpiCard
            label="Fraud Count"
            value={summary ? fmt(summary.fraud_transactions) : '—'}
            hint="Known fraud (is_fraud=1)"
          />
          <KpiCard
            label="Fraud Rate"
            value={summary ? pct(summary.fraud_rate) : '—'}
            hint="Fraud / total"
          />
          <KpiCard
            label="$ Amount at Risk"
            value={summary ? dollar(summary.fraud_amount) : '—'}
            hint="Sum of fraud transaction amounts"
          />
        </div>
      </section>

      {/* 2) Fraud by Category */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Fraud by Category</h2>
          <p className="sectionDesc">Fraud rate per merchant category, colored by group.</p>
        </div>
        <Panel title="Fraud Rate by Category" subtitle="DBSCAN outliers highlighted via Cluster Results below">
          {categories.length > 0 ? (
            <CategoryChart data={categories} />
          ) : (
            <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>Loading…</div>
          )}
        </Panel>
      </section>

      {/* 3) Fraud by Location */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Fraud by Location</h2>
          <p className="sectionDesc">Top 15 cities by fraud rate.</p>
        </div>
        <Panel title="Top 15 Cities by Fraud Rate">
          {locations.length > 0 ? (
            <LocationTable data={locations} />
          ) : (
            <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>Loading…</div>
          )}
        </Panel>
      </section>

      {/* 4) Fraud by Amount */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Fraud by Amount</h2>
          <p className="sectionDesc">Fraud rates across transaction size buckets.</p>
        </div>
        <Panel title="Fraud by Amount Bucket" subtitle="Risk tier from dim_amount_bucket">
          {amounts.length > 0 ? (
            <AmountTable data={amounts} />
          ) : (
            <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>Loading…</div>
          )}
        </Panel>
      </section>

      {/* 5) Cluster Results */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Cluster Results (Category)</h2>
          <p className="sectionDesc">DBSCAN assignments — cluster -1 are noise/outlier categories.</p>
        </div>
        <Panel title="DBSCAN Clusters — Category Dimension">
          {clusters.length > 0 ? (
            <ClusterPanel data={clusters} dimension="category" />
          ) : (
            <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>Loading…</div>
          )}
        </Panel>
      </section>

      {/* 6) Investigations Queue */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Investigations Queue</h2>
          <p className="sectionDesc">All LOF-flagged transactions sorted by score.</p>
        </div>
        <Panel
          title="LOF-Flagged Transactions"
          subtitle={flagged.length > 0 ? `${fmt(flagged.length)} anomalies` : ''}
          right={<span className="badge badgeBad">LOF</span>}
        >
          {flagged.length > 0 ? (
            <TransactionsTable rows={flagged.map(toTxRow)} showScore />
          ) : (
            <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>Loading…</div>
          )}
        </Panel>
      </section>

      {/* 7) Cross-method Flags */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Cross-Method Flags</h2>
          <p className="sectionDesc">Transactions caught by both LOF and at least one DBSCAN dimension.</p>
        </div>
        <Panel
          title="Double-Flagged Transactions"
          subtitle={doubleFlagged.length > 0 ? `${fmt(doubleFlagged.length)} intersections` : ''}
          right={<span className="badge badgeBad">LOF + DBSCAN</span>}
        >
          {doubleFlagged.length > 0 ? (
            <DoubleFlaggedTable data={doubleFlagged} />
          ) : (
            <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>Loading…</div>
          )}
        </Panel>
      </section>
    </div>
  )
}
