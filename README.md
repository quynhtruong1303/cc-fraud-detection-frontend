# Fraud Detection Frontend

React + Vite + TypeScript dashboard for visualizing credit card fraud analysis.

## Tech Stack

- React 19, TypeScript
- Vite
- TailwindCSS v4

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
  api/            # Fetch functions for the Express backend
  App.tsx         # Main dashboard layout
```

## Backend

This frontend connects to the Express API at `http://localhost:3000`. Make sure the backend is running before using live data.

See [this repo](https://github.com/quynhtruong1303/cc-fraud-detection-backend) for backend setup.
