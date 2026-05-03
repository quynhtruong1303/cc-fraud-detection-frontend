const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json()
}

export type Summary = {
  id: number
  total_transactions: number
  fraud_transactions: number
  fraud_rate: number
  total_amount: number
  fraud_amount: number
  computed_at: string
}

export type CategoryRow = {
  category: string
  display_label: string
  category_group: string
  sort_order: number
  total_transactions: number
  fraud_transactions: number
  fraud_rate: number
  total_amount: number
  fraud_amount: number
}

export type LocationRow = {
  state: string
  city: string
  total_transactions: number
  fraud_transactions: number
  fraud_rate: number
  total_amount: number
  fraud_amount: number
}

export type AmountRow = {
  amount_range: string
  bucket_id: number
  sort_order: number
  risk_tier: string
  min_amount: number
  max_amount: number | null
  total_transactions: number
  fraud_transactions: number
  fraud_rate: number
  total_amount: number
  fraud_amount: number
}

export type ClusterRow = {
  id: number
  dimension: string
  label: string
  cluster_assignment: number
  fraud_rate: number
  total_transactions: number
}

export type FlaggedRow = {
  trans_num: string
  trans_date_trans_time: string
  merchant: string
  category: string
  amt: number
  city: string
  state: string
  lof_score: number
  is_anomaly: boolean
}

export type GeoRow = {
  state: string
  city: string
  lat: number
  long: number
  total_transactions: number
  fraud_transactions: number
  fraud_rate: number
}

export type DoubleFlaggedRow = {
  transaction_id: string
  trans_date_trans_time: string
  category: string
  state: string
  city: string
  amt: number
  lof_score: number
  flagged_by_category_dbscan: boolean
  flagged_by_location_dbscan: boolean
  flagged_by_amount_dbscan: boolean
}

export const api = {
  summary: () => get<Summary>('/api/analytics/summary'),
  byCategory: () => get<CategoryRow[]>('/api/analytics/by-category'),
  byLocation: () => get<LocationRow[]>('/api/analytics/by-location'),
  byAmount: () => get<AmountRow[]>('/api/analytics/by-amount'),
  clusters: (dimension?: string) =>
    get<ClusterRow[]>(`/api/analytics/clusters${dimension ? `?dimension=${dimension}` : ''}`),
  byGeo: () => get<GeoRow[]>('/api/analytics/by-geo'),
  flagged: () => get<FlaggedRow[]>('/api/analytics/flagged'),
  doubleFlagged: () => get<DoubleFlaggedRow[]>('/api/analytics/double-flagged'),
}
