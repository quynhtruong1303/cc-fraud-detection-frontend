import KpiCard from './KpiCard'
import Panel from './Panel'
import Placeholder from './Placeholder'
import TransactionsTable, { type TxRow } from './TransactionsTable'

const mockFlagged: TxRow[] = [
  {
    id: 'tx_1001',
    timestamp: '2026-04-25 21:14',
    merchant: 'QuickMart #182',
    category: 'Retail',
    amount: 842.33,
    location: 'Denver, CO',
    status: 'flagged',
    score: 0.972,
  },
  {
    id: 'tx_1002',
    timestamp: '2026-04-25 20:58',
    merchant: 'Skyline Electronics',
    category: 'Electronics',
    amount: 1299.0,
    location: 'Miami, FL',
    status: 'declined',
    score: 0.989,
  },
  {
    id: 'tx_1003',
    timestamp: '2026-04-25 18:02',
    merchant: 'FuelNow',
    category: 'Gas',
    amount: 146.12,
    location: 'Aurora, CO',
    status: 'flagged',
    score: 0.915,
  },
]

export default function AnalystDashboard() {
  return (
    <div className="dash">
      <section className="filters">
        <div className="filterPill">Date range (placeholder)</div>
        <div className="filterPill">State/City (placeholder)</div>
        <div className="filterPill">Merchant/Category (placeholder)</div>
        <div className="filterPill">Amount range (placeholder)</div>
        <div className="filterPill">Score threshold (placeholder)</div>
      </section>

      <section className="kpis">
        <KpiCard label="Total Transactions" value="128,442" hint="Filtered range" />
        <KpiCard label="Fraud Transactions" value="1,204" hint="Flagged/declined" />
        <KpiCard label="Fraud Rate" value="0.94%" hint="Fraud / total" />
        <KpiCard label="Fraud Amount" value="$412,870" hint="Sum flagged/declined" />
      </section>

      <div className="grid">
        <Panel
          title="Fraud Frequency Over Time"
          subtitle="Fraud vs non-fraud counts by day/week"
        >
          <Placeholder label="Line chart placeholder" />
        </Panel>

        <Panel title="Fraud Rate Over Time" subtitle="Fraud % trend">
          <Placeholder label="Area chart placeholder" />
        </Panel>

        <Panel
          title="Amount Distribution"
          subtitle="Histogram (fraud vs non-fraud)"
        >
          <Placeholder label="Histogram placeholder" />
        </Panel>

        <Panel title="Top Merchants by Fraud" subtitle="Ranked by fraud count/rate">
          <Placeholder label="Bar chart placeholder" />
        </Panel>

        <Panel title="Geographic Hotspots" subtitle="Top states/cities by fraud">
          <Placeholder label="Map or bar chart placeholder" />
        </Panel>

        <Panel
          title="Recent Flagged Transactions"
          subtitle="Use this table for investigations"
          right={<button className="btn">Export (later)</button>}
        >
          <TransactionsTable rows={mockFlagged} showScore />
        </Panel>
      </div>
    </div>
  )
}