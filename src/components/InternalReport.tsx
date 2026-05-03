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
import PageNav from './PageNav'

const Spinner = () => <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>Loading…</div>
const Empty = () => <div style={{ color: 'var(--muted-2)', padding: 12, fontSize: 13 }}>No data</div>

function fmt(n: number) { return n.toLocaleString() }
function pct(r: number) { return (r * 100).toFixed(2) + '%' }

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
  const [clustersCat, setClustersCat] = useState<ClusterRow[]>([])
  const [clustersLoc, setClustersLoc] = useState<ClusterRow[]>([])
  const [clustersAmt, setClustersAmt] = useState<ClusterRow[]>([])
  const [flagged, setFlagged] = useState<FlaggedRow[]>([])
  const [doubleFlagged, setDoubleFlagged] = useState<DoubleFlaggedRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [page, setPage] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    Promise.allSettled([
      api.summary(),
      api.byCategory(),
      api.byLocation(),
      api.byAmount(),
      api.clusters('category'),
      api.clusters('location'),
      api.clusters('amount'),
      api.flagged(),
      api.doubleFlagged(),
    ]).then(([s, c, l, a, clCat, clLoc, clAmt, f, df]) => {
      if (s.status === 'fulfilled') setSummary(s.value)
      if (c.status === 'fulfilled') setCategories(c.value)
      if (l.status === 'fulfilled') setLocations(l.value)
      if (a.status === 'fulfilled') setAmounts(a.value)
      if (clCat.status === 'fulfilled') setClustersCat(clCat.value)
      if (clLoc.status === 'fulfilled') setClustersLoc(clLoc.value)
      if (clAmt.status === 'fulfilled') setClustersAmt(clAmt.value)
      if (f.status === 'fulfilled') setFlagged(f.value)
      if (df.status === 'fulfilled') setDoubleFlagged(df.value)
      setLoaded(true)
    })
  }, [])

  return (
    <div className="page">
      <header className="reportHeader">
        <h1 className="title">Credit Card Fraud Pattern Analysis Dashboard</h1>
        <PageNav page={page} onPage={setPage} />
      </header>

      {/* ── Page 1: Data Overview ── */}
      {page === 1 && (
        <>
          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Dataset Summary</h2>
              <p className="sectionDesc">14,000 real-world credit card transactions with ground-truth fraud labels. These KPIs frame the baseline before any model runs.</p>
            </div>
            <div className="kpis">
              <KpiCard label="Total Transactions" value={summary ? fmt(summary.total_transactions) : '—'} hint="transactions_detailed" />
              <KpiCard label="Fraud Count" value={summary ? fmt(summary.fraud_transactions) : '—'} hint="Known fraud (is_fraud = 1)" />
              <KpiCard label="Fraud Rate" value={summary ? pct(summary.fraud_rate) : '—'} hint="Fraud / total" />
            </div>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Fraud by Category</h2>
              <p className="sectionDesc">Fraud rate per merchant category. Shopping and travel categories carry disproportionately high fraud rates.</p>
            </div>
            <Panel title="Fraud Rate by Category">
              {!loaded ? <Spinner /> : categories.length > 0 ? <CategoryChart data={categories} /> : <Empty />}
            </Panel>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Fraud by Location</h2>
              <p className="sectionDesc">Top 15 cities by fraud rate — geographic concentration is a strong signal for downstream clustering.</p>
            </div>
            <Panel title="Top 15 Cities by Fraud Rate">
              {!loaded ? <Spinner /> : locations.length > 0 ? <LocationTable data={locations} /> : <Empty />}
            </Panel>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Fraud by Amount</h2>
              <p className="sectionDesc">Fraud rates across transaction size buckets. High-value transactions carry elevated risk.</p>
            </div>
            <Panel title="Fraud by Amount Bucket">
              {!loaded ? <Spinner /> : amounts.length > 0 ? <AmountTable data={amounts} /> : <Empty />}
            </Panel>
          </section>
        </>
      )}

      {/* ── Page 2: Clustering ── */}
      {page === 2 && (
        <>
          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">DBSCAN Clustering</h2>
              <p className="sectionDesc">We ran DBSCAN independently across three dimensions — category, location, and amount. Labels flagged as cluster -1 are noise points: the algorithm could not group them into any normal pattern, making them statistical outliers worth investigating.</p>
            </div>
            <div className="callout">
              <div className="calloutTitle">How to read these results</div>
              <p className="calloutText">Clusters numbered 0, 1, 2… represent coherent groups of similar transactions. <strong style={{ color: 'var(--text)' }}>Cluster -1 (shown in red) means DBSCAN found no neighbors close enough</strong> — these are the anomalies our pipeline flags for further review.</p>
            </div>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Category Clusters</h2>
            </div>
            <Panel title="DBSCAN — Category Dimension">
              {!loaded ? <Spinner /> : clustersCat.length > 0 ? <ClusterPanel data={clustersCat} dimension="category" /> : <Empty />}
            </Panel>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Location Clusters</h2>
            </div>
            <Panel title="DBSCAN — Location Dimension">
              {!loaded ? <Spinner /> : clustersLoc.length > 0 ? <ClusterPanel data={clustersLoc} dimension="location" /> : <Empty />}
            </Panel>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Amount Clusters</h2>
            </div>
            <Panel title="DBSCAN — Amount Dimension">
              {!loaded ? <Spinner /> : clustersAmt.length > 0 ? <ClusterPanel data={clustersAmt} dimension="amount" /> : <Empty />}
            </Panel>
          </section>
        </>
      )}

      {/* ── Page 3: LOF Findings ── */}
      {page === 3 && (
        <>
          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">LOF Anomaly Detection</h2>
              <p className="sectionDesc">Local Outlier Factor scores each transaction against its neighbors. Transactions with a score below our threshold (−0.059) are flagged as anomalies — a recall-first approach that minimises missed fraud.</p>
            </div>
            <div className="kpis">
              <KpiCard
                label="LOF-Flagged Transactions"
                value="2,059"
                hint="Model output — Render free tier caps API response at 1,000"
              />
              <KpiCard
                label="% of Dataset"
                value="14.71%"
                hint="2,059 of 14,000 transactions"
              />
            </div>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Cross-Method Flags</h2>
              <p className="sectionDesc">Transactions caught by both LOF and at least one DBSCAN dimension. Double-flagged records are the highest-confidence fraud suspects — two independent methods agree.</p>
            </div>
            <Panel
              title="Double-Flagged Transactions"
              subtitle={loaded && doubleFlagged.length > 0 ? `${fmt(doubleFlagged.length)} intersections` : ''}
              right={<span className="badge badgeBad">LOF + DBSCAN</span>}
            >
              {!loaded ? <Spinner /> : doubleFlagged.length > 0 ? <DoubleFlaggedTable data={doubleFlagged} /> : <Empty />}
            </Panel>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">All LOF-Flagged Transactions</h2>
              <p className="sectionDesc">Full investigations queue — every transaction the LOF model flagged, sorted by anomaly score.</p>
            </div>
            <Panel
              title="LOF-Flagged Transactions"
              subtitle={loaded && flagged.length > 0 ? `${fmt(flagged.length)} anomalies` : ''}
              right={<span className="badge badgeBad">LOF</span>}
            >
              {!loaded ? <Spinner /> : flagged.length > 0 ? <TransactionsTable rows={flagged.map(toTxRow)} showScore /> : <Empty />}
            </Panel>
          </section>
        </>
      )}
    </div>
  )
}
