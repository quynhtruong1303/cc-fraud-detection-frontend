import KpiCard from './KpiCard'
import Panel from './Panel'
import Placeholder from './Placeholder'
import TransactionsTable, { type TxRow } from './TransactionsTable'

const mockRecent: TxRow[] = [
  {
    id: 'tx_2001',
    timestamp: '2026-04-25 19:44',
    merchant: 'Green Grocer',
    category: 'Grocery',
    amount: 54.27,
    location: 'Denver, CO',
    status: 'approved',
  },
  {
    id: 'tx_2002',
    timestamp: '2026-04-25 17:10',
    merchant: 'FuelNow',
    category: 'Gas',
    amount: 61.98,
    location: 'Denver, CO',
    status: 'approved',
  },
  {
    id: 'tx_2003',
    timestamp: '2026-04-24 23:59',
    merchant: 'Skyline Electronics',
    category: 'Electronics',
    amount: 1299.0,
    location: 'Miami, FL',
    status: 'declined',
  },
]

export default function CardholderDashboard() {
  return (
    <div className="dash">
      <section className="filters">
        <div className="filterPill">Date range (placeholder)</div>
        <div className="filterPill">Category (placeholder)</div>
        <div className="filterPill">Amount range (placeholder)</div>
      </section>

      <section className="kpis">
        <KpiCard label="Total Spend" value="$2,148.92" hint="Selected range" />
        <KpiCard label="Transactions" value="42" hint="Count" />
        <KpiCard label="Avg Amount" value="$51.16" hint="Avg per transaction" />
        <KpiCard label="Flagged/Declined" value="1" hint="Potential fraud" />
      </section>

      <div className="grid">
        <Panel title="Spending Over Time" subtitle="Daily/weekly spend trend">
          <Placeholder label="Line chart placeholder" />
        </Panel>

        <Panel title="Spending by Category" subtitle="Where your money goes">
          <Placeholder label="Pie/bar chart placeholder" />
        </Panel>

        <Panel title="Unusual Activity Summary" subtitle="Alerts & guidance">
          <div className="callout">
            <div className="calloutTitle">1 transaction needs review</div>
            <div className="calloutText">
              A high-value purchase attempt was declined outside your usual area.
              If this wasn’t you, contact your bank and freeze your card.
            </div>
          </div>
        </Panel>

        <Panel title="Recent Transactions" subtitle="Most recent activity">
          <TransactionsTable rows={mockRecent} />
        </Panel>
      </div>
    </div>
  )
}