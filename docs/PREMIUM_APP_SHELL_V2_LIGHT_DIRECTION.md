# Premium App Shell v2 Light Direction

## Status

Light v2 is the primary production visual direction for future UI work in `mplus-banana-html`.

Dark v2 is future/reference-only. It must not replace Light v2 unless the owner explicitly approves a later dark-mode or dark-theme phase.

The reference files are visual/design references only:

- `index-light.html`
- `dashboard-light.html`
- `reports-light.html`
- `compare-light.html`
- `staff-targets-light.html`
- `mapping-light.html`
- `export-light.html`
- `branches-light.html`

Do not paste or overwrite production pages with mockup HTML.  
Do not port mock JavaScript into production behavior.

## Main Visual Direction

The app should feel like a modern premium dashboard application, not a normal static report website.

Use Light v2 as the baseline direction:

- desktop sidebar app shell
- mobile top bar with hamburger overlay
- light gray-blue application background
- white cards
- soft borders
- soft shadows
- rounded panels
- gradient hero cards
- KPI cards
- bento grid layout
- compact tables
- chart panels
- clear status, warning, readiness, and guardrail panels

Avoid:

- old plain top-nav website feeling
- flat form/table-only pages
- unclear production wording
- fake live-system wording
- hidden prototype/sample/readiness warnings

## App Shell Direction

### Desktop

- Use a left sidebar app shell.
- Target sidebar width: `220px`.
- Main content should sit to the right of the sidebar.
- Page content padding should stay around `24px`.
- Use a compact, app-like navigation system.
- Keep page actions and context controls inside premium workspace panels.
- Use bento-style grids for dashboard/report/analytics pages.

### Mobile

- Hide the desktop sidebar.
- Show a mobile top bar.
- Use a hamburger overlay menu.
- Stack content vertically.
- Keep hero and warning/status content visible early.
- Preserve bottom navigation compatibility where it already exists.
- Avoid page-wide horizontal overflow.
- Keep tables and chart panels contained and scrollable when needed.

## Layout Components

### Bento Grid

Use bento-style layouts for premium workspace pages:

- large hero card
- mixed-size KPI cards
- compact insight cards
- contained table panels
- chart panels
- helper or guardrail cards

### Hero Cards

Hero cards should communicate the page's main purpose quickly.

Recommended hero patterns:

- gradient background
- clear title
- short context label
- primary status or KPI
- one or two route links only when already part of the current app flow

Hero cards must not imply production readiness or real live data unless separately approved.

### KPI Cards

KPI cards should be compact, scannable, and grouped by meaning.

Use KPI cards for:

- sales summaries
- device count summaries
- report totals
- comparison highlights
- readiness counts
- sample/prototype state

### Tables

Tables should feel like contained data panels, not page-dominating raw sheets.

Rules:

- compact rows
- clear headers
- horizontal scroll on small screens
- missing values displayed distinctly from zero
- no page-wide overflow
- guardrail/status context near data tables

### Chart Panels

Charts should sit inside premium panels with:

- title
- short context
- visible fallback if the chart cannot render
- mobile-safe sizing
- no new chart dependency unless explicitly approved

## Color Direction

Base colors:

- background: `#EAECF5`
- card: `#FFFFFF`
- border: `#E0E4F0`
- text: `#1A1D2E`
- muted text: `#6B7A99`
- subtle muted text: `#A0AABB`

Brand accents:

- Banana gold: `#F5C018`
- Deep banana accent: `#C8860A`
- Primary blue: `#4A6CF7`
- Green: `#059669`
- Purple: `#7C3AED`
- Teal: `#0891B2`
- Amber warning: `#D97706`

## Page Accent Map

### Reports

- Accent: blue
- Hero direction: navy to indigo
- Purpose: monthly/report summary workspace

### Compare

- Accent: indigo/blue
- Hero direction: deep navy to violet
- Purpose: analytics and branch comparison workspace

### Staff Targets

- Accent: gold
- Hero direction: navy to purple
- Purpose: branch-level focus-brand target dashboard

### Mapping

- Accent: green
- Hero direction: deep teal
- Purpose: CSV readiness and mapping explanation workspace

### Export

- Accent: purple
- Hero direction: deep purple
- Purpose: copy-only summary workspace

### Branches

- Accent: teal
- Hero direction: ocean teal
- Purpose: branch overview and readiness workspace

## Guardrails

These guardrails apply to all future UI work.

Do not add or imply:

- production readiness
- official live dashboard status
- live CSV wording unless explicitly approved
- backend integration
- Auth integration
- Firebase integration
- API integration
- AI features
- Chat features
- Stock features
- PDF export
- Excel export
- file download behavior
- new dependencies
- new CDNs
- new fonts
- new package tooling

Always preserve:

- sample/prototype/readiness warnings
- existing IDs used by page JavaScript
- existing page behavior
- existing parser behavior
- existing CSV behavior
- existing business rules
- relative links
- review-before-commit workflow

## Business Rules

These rules must remain unchanged unless separately approved.

```text
totalSales = systemSales + outsideSystemSales
```

- CSV `ยอดรวม` is cross-check/validation only.
- CSV `ยอดรวม` must not be used as the official total.
- Finance, contract, and profit values are supporting metrics only.
- Finance, contract, and profit must not be included in official sales total.
- Missing data is not zero.
- A dash or `—` means missing/not applicable, not zero.
- Real `0` remains a valid value.
- Staff targets are branch-level only.
- Staff targets are not personal staff sales.
- Staff targets are not commission calculation.

## Reference File Usage Rules

The Light reference files are design references only.

When porting from references:

- do not paste full mockup files directly into production pages
- do not overwrite production pages wholesale
- do not port mock JavaScript into production behavior
- do not add new dependencies, CDNs, fonts, or tooling
- extract reusable styling into `css/style.css`
- preserve existing IDs used by JavaScript
- preserve current working behavior
- keep all warnings and guardrails visible
- use relative links only
- port one page or shell phase at a time
- return full diff for GPT/JPT review before staging, committing, pushing, or deploying

## Future Migration Phases

### Phase A: Documentation Direction

Create this Light v2 direction document so future work has a stable visual and guardrail reference.

### Phase B: App Shell v2 Proposal

Propose the next app shell direction before implementation.

This should cover:

- desktop sidebar
- mobile top bar
- hamburger overlay
- navigation behavior
- active states
- responsive rules
- affected files
- risk and guardrail review

### Phase C: App Shell v2 Implementation

Implement the approved shell skeleton only after GPT/JPT approval.

Expected scope may include:

- shared HTML shell structure
- `css/style.css`
- `js/app.js` only if approved for navigation behavior

No parser, CSV, business, backend, export, or data behavior changes.

### Phase D: Home Port

Port Home toward the Light v2 command center direction.

Preserve:

- route links
- `#roleSelect`
- `#branchSelect`
- sample/prototype warnings
- no production-readiness implication

### Phase E: Dashboard Port

Port Dashboard further toward the Light v2 dashboard direction.

Preserve:

- dashboard IDs used by existing scripts
- CSV preview behavior
- daily table gate behavior
- parser behavior
- sample/prototype/readiness warnings
- business rules

### Phase F: Page-by-Page Ports

Port remaining pages one at a time:

- Reports
- Compare
- Staff Targets
- Mapping
- Export
- Branches

Each page must have its own approval gate, diff review, commit approval, and live verification.

### Phase G: CSV and Parser Work Later

Return to CSV/parser production-readiness work only after the UI direction is stable.

Do not mix UI porting with parser, CSV, validation, dashboard data replacement, backend, export, or business-rule changes unless explicitly approved.
