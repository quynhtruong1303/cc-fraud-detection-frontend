import { useMemo, useState } from 'react'
import './App.css'

import Tabs, { type TabItem } from './components/Tabs'
import AnalystDashboard from './components/AnalystDashboard'
import CardholderDashboard from './components/CardholderDashboard'

function App() {
  const tabs: TabItem[] = useMemo(
    () => [
      { id: 'analyst', label: 'Analyst Dashboard' },
      { id: 'cardholder', label: 'Cardholder Dashboard' },
    ],
    []
  )

  const [activeTab, setActiveTab] = useState<TabItem['id']>('analyst')

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">Fraud Detection Dashboard</h1>
          <p className="subtitle">
            Outline view (mock data). Later you can replace panels with Superset
            embeds or live API data.
          </p>
        </div>

        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      </header>

      <main className="content">
        {activeTab === 'analyst' ? <AnalystDashboard /> : <CardholderDashboard />}
      </main>
    </div>
  )
}

export default App