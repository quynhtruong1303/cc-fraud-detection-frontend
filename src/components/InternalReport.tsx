import KpiCard from './KpiCard'
import Panel from './Panel'
import Placeholder from './Placeholder'
import TransactionsTable, { type TxRow } from './TransactionsTable'

const takeaways = [
  'Fraud is highly imbalanced; reporting focuses on rate, $ exposure, and investigation queue.',
  'Amount-based segmentation is included since some datasets may be anonymized (no merchant/location).',
  'Next step: export notebook aggregates to JSON and replace these mock values.',
]

const investigations: TxRow[] = [
  {
    id: 'inv_001',
    timestamp: '2026-04-25 21:14',
    merchant: 'N/A (anonymized)',
    category: 'N/A',
    amount: 842.33,
    location: 'N/A',
    status: 'flagged',
    score: 0.972,
  },
  {
    id: 'inv_002',
    timestamp: '2026-04-25 20:58',
    merchant: 'N/A (anonymized)',
    category: 'N/A',
    amount: 1299.0,
    location: 'N/A',
    status: 'declined',
    score: 0.989,
  },
  {
    id: 'inv_003',
    timestamp: '2026-04-25 18:02',
    merchant: 'N/A (anonymized)',
    category: 'N/A',
    amount: 146.12,
    location: 'N/A',
    status: 'flagged',
    score: 0.915,
  },
]

const amountBuckets = [
  { bucket: '$0–$10', fraudRate: '0.3%', fraudCount: 120, total: 40120 },
  { bucket: '$10–$50', fraudRate: '0.6%', fraudCount: 540, total: 90210 },
  { bucket: '$50–$200', fraudRate: '1.1%', fraudCount: 410, total: 37200 },
  { bucket: '$200+', fraudRate: '2.4%', fraudCount: 134, total: 5580 },
]

export default function InternalReport() {
  return (
    <div className="page">
      <header className="reportHeader">
        <div>
          <h1 className="title">Credit Card Fraud Detection — Internal Report</h1>
          <p className="subtitle">
            Showcase dashboard (mock data). Replace with notebook-exported JSON later.
          </p>

          <div className="metaRow">
            <span className="metaPill">Datasets: Kaggle (2 sources)</span>
            <span className="metaPill">Audience: Fraud analytics team</span>
            <span className="metaPill">Last updated: 2026-04-30</span>
          </div>
        </div>
      </header>

      {/* 1) Executive Summary */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Executive Summary</h2>
          <p className="sectionDesc">High-level view for ops and triage.</p>
        </div>

        <div className="kpis">
          <KpiCard label="Total Transactions" value="128,442" hint="Selected period" />
          <KpiCard label="Fraud Count" value="1,204" hint="Known + flagged" />
          <KpiCard label="Fraud Rate" value="0.94%" hint="Fraud / total" />
          <KpiCard label="$ Amount at Risk" value="$412,870" hint="Est. fraud sum" />
        </div>

        <Panel title="Key Takeaways" subtitle="Short bullet summary (report-style)">
          <ul className="bullets">
            {takeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* 2) Trends */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Trends</h2>
          <p className="sectionDesc">How fraud volume and rate change over time.</p>
        </div>

        <div className="grid">
          <Panel title="Fraud Count Over Time" subtitle="Daily/weekly fraud volume">
            <Placeholder label="Line chart placeholder (fraud count over time)" />
          </Panel>

          <Panel title="Fraud Rate Over Time" subtitle="Fraud % trend">
            <Placeholder label="Line/area chart placeholder (fraud rate over time)" />
          </Panel>
        </div>
      </section>

      {/* 3) Where + What */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Where + What</h2>
          <p className="sectionDesc">Breakdowns to identify patterns and hotspots.</p>
        </div>

        <div className="grid">
          <Panel title="Fraud by Amount Bucket" subtitle="Simple segmentation for risk review">
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bucket</th>
                    <th className="num">Fraud rate</th>
                    <th className="num">Fraud count</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {amountBuckets.map((r) => (
                    <tr key={r.bucket}>
                      <td>{r.bucket}</td>
                      <td className="num">{r.fraudRate}</td>
                      <td className="num">{r.fraudCount}</td>
                      <td className="num">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Optional Breakdown" subtitle="Category/location/merchant (depends on columns)">
            <Placeholder label="If available: top categories/locations/merchants" />
          </Panel>
        </div>
      </section>

      {/* 4) Investigations */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Investigations Queue</h2>
          <p className="sectionDesc">Recent/high-risk transactions for analyst review.</p>
        </div>

        <Panel
          title="Recent Flagged Transactions"
          subtitle="Sorted by risk score (planned)"
          right={<button className="btn">Export (later)</button>}
        >
          <TransactionsTable rows={investigations} showScore />
        </Panel>
      </section>
    </div>
  )
}