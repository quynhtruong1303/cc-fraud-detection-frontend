# Credit Card Fraud Pattern Analysis Dashboard

React + Vite + TypeScript dashboard for visualizing credit card fraud detection analysis.

**Live:** https://cc-fraud-detection-dashboard.onrender.com

## Tech Stack

- React 19, TypeScript
- Vite
- Recharts, d3-geo

## Pages

| Page | Description |
|---|---|
| Data Overview | KPI summary, fraud by category/location/amount, geographic map |
| Clustering | DBSCAN cluster assignments across category, location, and amount dimensions |
| LOF Findings | LOF anomaly scores, model development story, cross-method flags, full investigations queue |

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Project Structure

```
src/
  components/     # Reusable UI components
  api.ts          # Typed fetch wrapper for all backend endpoints
  App.tsx         # Root component
public/
  plots/          # Pre-generated clustering and LOF model plots
```

## Backend

Production API: https://cc-fraud-detection-backend.onrender.com

For local development, set `VITE_API_URL=http://localhost:3000` in a `.env.local` file.

See [cc-fraud-detection-backend](https://github.com/quynhtruong1303/cc-fraud-detection-backend) for backend setup.
