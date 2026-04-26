export type TabItem = {
  id: string
  label: string
}

type TabsProps = {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
}

export default function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="Dashboard tabs">
      {tabs.map((t) => {
        const isActive = t.id === activeId
        return (
          <button
            key={t.id}
            type="button"
            className={`tab ${isActive ? 'tabActive' : ''}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}