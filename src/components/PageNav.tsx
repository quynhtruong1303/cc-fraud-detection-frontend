type Page = 1 | 2 | 3

const LABELS: Record<Page, string> = {
  1: 'Data Overview',
  2: 'Clustering',
  3: 'LOF Findings',
}

export default function PageNav({ page, onPage }: { page: Page; onPage: (p: Page) => void }) {
  return (
    <div className="tabs">
      {([1, 2, 3] as Page[]).map(p => (
        <button
          key={p}
          className={`tab${page === p ? ' tabActive' : ''}`}
          onClick={() => onPage(p)}
        >
          {LABELS[p]}
        </button>
      ))}
    </div>
  )
}
