# Mplus Banana HTML Quick Version

Standalone static HTML/CSS/JS prototype for the Mplus Banana sales dashboard.

## Phase 1 Scope

- Static multi-page dashboard prototype.
- Google Sheet Published CSV loading.
- Header-based CSV mapping.
- Dashboard, monthly reports, compare charts, branch settings, mapping, staff target progress, and copy-summary export.
- Approved role keys only: `CREATOR`, `OWNER`, `ADMIN`, `STAFF`, `VIEWER`.
- Placeholder CSV URLs and prototype sample rows are used until real Published CSV links are provided.
- `vendor/chartjs-loader.js` loads Chart.js from a CDN and does not vendor or copy the Chart.js library file.

## Prototype Data Notice

Any sample rows shown in the dashboard, reports, or copy summary are prototype sample data only. They are not real CSV data and must not be treated as store sales.

## Out Of Scope

- React, Vite, package managers, and build tooling.
- Firebase real config, reads, or writes.
- Production authentication.
- AI Assistant.
- Realtime Chat.
- Stock upload/OCR.
- Full PDF/Excel export.

## Sales Rule

```text
totalSales = systemSales + outsideSystemSales
```

Finance amount, contract count, profit, and other supporting metrics are shown separately and are not included in total sales.

## Data State Rule

- Missing row, unavailable CSV, or unmapped field = missing/not found.
- Existing row with numeric value `0` = valid zero value.

## How To Open Locally

Do not double-click `index.html` or open it through a direct `file://` path. This project uses browser ES module imports, so direct file opening is not supported or reliable.

Open the site through a local static server from the project folder:

```powershell
python -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/index.html
```

On Windows, you can also run:

```text
start-local-server.bat
```

Cloudflare Pages or another static hosting service is also valid later.
