# CSV Production Integration Approval Package

Status: proposed approval package / no implementation approved  
Latest baseline commit: `4b466b5 docs: add live csv url change procedure`  
Scope: production integration decision package only  
Implementation status: not approved

## Executive Summary

Controlled CSV MVP is stable and ready for continued controlled use. Level 0 daily-table-only integration is approved and live: CSV may power the Dashboard daily table only when Parser is ok.

Level 1 diagnostics polish is implemented and live verified. The Live CSV URL Change Procedure and Rollback Checklist exists. Production integration beyond the daily table is not approved yet.

## Current Evidence Checklist

| Evidence item | Status | Commit/doc reference | What it proves |
| --- | --- | --- | --- |
| Controlled CSV MVP closure status | CLOSED / READY | `docs/CSV_MVP_CONTROLLED_USE_CLOSURE_STATUS.md` | Controlled daily-table-only CSV use is ready to continue. |
| P3 fetch-failure simulation closure | CLOSED | `docs/CSV_MVP_P3_FETCH_FAILURE_SIMULATION_CLOSURE.md` | Targeted CSV fetch failure restores sample daily table safely. |
| CSV production integration planning | PLANNING ONLY | `docs/CSV_PRODUCTION_INTEGRATION_PLANNING.md` | Production expansion requires separate planning and approval. |
| CSV governance/surface readiness pack | PLANNING ONLY | `docs/CSV_PRODUCTION_GOVERNANCE_AND_SURFACE_READINESS_PACK.md` | Governance and surface-readiness decisions remain required before production expansion. |
| Dashboard Level 1 diagnostics closure | LIVE VERIFIED / CLOSED | `a2ba804`, `docs/DASHBOARD_LEVEL_1_DIAGNOSTICS_POLISH_CLOSURE_STATUS.md` | Grouped diagnostics are live verified and behavior-preserving. |
| Live CSV URL procedure | PROCEDURE ONLY | `4b466b5`, `docs/LIVE_CSV_URL_CHANGE_PROCEDURE_AND_ROLLBACK_CHECKLIST.md` | Future URL changes require proposal, approval, smoke, fallback, and rollback checks. |

## Current Protected State

- Parser guard remains `52/52`.
- Normal CSV state remains 372 preview rows / 372 daily rows.
- Fallback state remains 8 sample rows.
- Source notes are not misleading and include row count.
- Hero/cards/charts remain sample/prototype.
- Mapping remains readiness-only.
- Official total formula remains `systemSales + outsideSystemSales`.
- CSV `ยอดรวม` remains cross-check only, not official total.
- No blocking P0/P1/P2/P3 issues are open.

## Production Integration Decision Options

### Option A: Continue Controlled Use Only

- Safest option.
- No new implementation.
- Continue operating under daily-table-only CSV boundary.
- Keep collecting real store feedback and issue log entries.

### Option B: Level 1 Follow-Up Only

- Small diagnostics polish only if real store feedback appears.
- No behavior change.
- No parser/dashboard gate changes.
- No hero/cards/charts CSV integration.

### Option C: CSV Production Governance Hardening

- Owner/source-of-truth decisions.
- Live URL ownership.
- Rollback ownership.
- Still docs/process first.
- No production behavior change until separately approved.

### Option D: Dashboard Level 2 Summary Cards Readiness Planning

- Planning only.
- No implementation yet.
- Requires formula audit, source-of-truth decision, and sample-to-CSV transition plan.
- Must preserve `totalSales = systemSales + outsideSystemSales`.

### Option E: Begin Backend/Database Planning

- Docs/planning only.
- For future real production readiness.
- No Firebase/Auth/API implementation approved by this package.

## Owner Decisions Required

- Who owns the CSV?
- Who can edit CSV structure?
- Who can change the live CSV URL?
- What is normal row-count variance?
- What is the official source of truth?
- When should cards/charts become CSV-driven?
- Should production move toward backend/database instead of CSV-only?
- Who approves rollback?

## Approval Gates Before Any Implementation

Before any implementation beyond the current controlled CSV MVP:

- Owner decision recorded.
- Exact scope defined.
- Full content/full diff returned for review.
- Parser guard run and passing.
- Local smoke completed.
- Live smoke completed.
- Cache-busted smoke completed.
- Mobile 390x844 smoke completed.
- Fallback test completed.
- Post-restore test completed.
- No behavior changes unless explicitly approved.
- GPT/JPT approval before staging, committing, pushing, or deploying.

## Non-Goals

This package does not approve:

- Parser changes.
- Live CSV URL changes.
- Daily table gate changes.
- Hero/cards/charts CSV integration.
- Official formula changes.
- Backend/Auth/Firebase/API.
- AI/chat/stock/OCR/loan calculator.
- PDF/Excel/file export.
- Deploy.

## Risk Register

| Risk | Mitigation |
| --- | --- |
| Owner/source of truth unclear | Require owner decision before production expansion. |
| CSV structure drift | Require column/header structure approval and parser guard before any change. |
| Row count mismatch | Define expected row count and acceptable variance before implementation. |
| URL change risk | Use the Live CSV URL Change Procedure and Rollback Checklist. |
| Staff trust risk | Keep visible daily-table-only and sample/prototype boundary wording. |
| Formula drift | Require formula audit and preserve `systemSales + outsideSystemSales`. |
| Cache confusion | Test normal and cache-busted routes after changes. |
| Future cards/charts mismatch | Do not implement cards/charts CSV until formulas, ownership, and source mapping are approved. |
| Production expectation mismatch | Keep controlled-use wording visible until real production scope is approved. |

## Recommended Decision

Continue controlled use while collecting real store feedback.

The next work should be owner decisions plus governance hardening, or Dashboard Level 2 summary cards readiness planning only. Do not implement cards/charts CSV until owner decisions and formula audit are complete.

## Final Approval Section

- Owner decision:
- GPT/JPT decision:
- Approved next option:
- Approved scope:
- Not approved:
- Required next artifact:

## Guardrails Preserved

- No code changes.
- No parser changes.
- No CSV behavior changes.
- No live CSV URL changes.
- No daily table gate changes.
- No Dashboard hero/cards/charts changes.
- No backend/Auth/Firebase/API.
- No AI/Chat/Stock/OCR/Loan Calculator.
- No PDF/Excel/file export.
- No dependency/tooling changes.
- No deploy.
