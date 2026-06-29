# CSV Production Integration Planning

Status: proposed planning-only phase

Latest baseline commit: `ba5f65c docs: add csv mvp controlled use closure`

Scope: planning only, no production implementation approved yet

## Current Baseline

Controlled CSV MVP is ready for continued controlled use.

Current approved scope:

- CSV currently powers only the Dashboard daily table when `Parser: ok`.
- Normal CSV state: `372` preview rows / `372` daily rows.
- Fetch failure returns the sample/fallback daily table with `8` rows.
- Hero/cards/charts are not CSV-driven.
- Mapping remains readiness-only.
- Current system is still not full production.

## Production Integration Goals

Future CSV production integration should establish:

- Stronger CSV governance
- Approved live URL policy
- Clear data ownership
- Parser/data validation ownership
- Audit trail for CSV changes
- Dashboard surfaces that may later become CSV-driven
- Clear rollback/fallback behavior
- Clear owner approval before any production behavior change

## Non-Goals For This Planning Doc

This document does not approve:

- Code changes
- Parser changes
- Live CSV URL changes
- Cards/charts CSV replacement
- Backend/Auth/Firebase/API
- AI/chat/stock/OCR/loan calculator
- PDF/Excel/file export
- Deployment

## Data Governance Questions

Owner decisions needed before production integration:

- Who owns the live CSV?
- Who may change CSV structure?
- Who may change the live CSV URL?
- How are CSV changes announced?
- What is the rollback process if CSV breaks?
- What row count changes are expected vs suspicious?
- How long should historical CSV data be retained?
- What is the source of truth for official totals?

## Live CSV URL Policy Draft

- Current URL must not change without review.
- Any new URL needs a proposal, approval, live smoke test, and rollback note.
- URL changes must not be bundled with parser/dashboard changes unless explicitly approved.
- Cache-busted checks should be documented for every URL change or production-readiness smoke.

## Dashboard Surface Integration Ladder

| Level | Scope | Approval gate | QA gate |
| --- | --- | --- | --- |
| Level 0 | Current controlled use — daily table only | Already approved for controlled use | Parser guard, live smoke, fallback proof |
| Level 1 | Daily table diagnostics polish | Proposal and full diff review | Parser guard, desktop/mobile smoke, fallback check |
| Level 2 | Limited CSV-backed summary cards, planning only | Separate owner approval required before implementation | Formula audit, fixture tests, live smoke, mixed-state review |
| Level 3 | Selected charts CSV-backed, planning only | Separate owner approval required before implementation | Chart data audit, mobile smoke, fallback behavior proof |
| Level 4 | Production dashboard integration, not approved yet | Production integration approval package required | Full regression, owner acceptance, rollback plan |

No level above Level 0 is approved by this document.

## Business Rule Guardrails

- `totalSales = systemSales + outsideSystemSales`.
- CSV ยอดรวม remains cross-check/validation only unless explicitly approved otherwise.
- Missing / dash / `—` is not zero.
- Finance / contract / profit are supporting metrics only.
- Staff Targets are branch-level only, not personal sales, not commission, not payroll, and not employee ranking.

## Approval Gates Before Implementation

Before any production integration implementation:

1. Proposal
2. Full diff/full content for review
3. Parser guard
4. Live smoke test
5. Mobile smoke test
6. Fallback test
7. Owner acceptance
8. GPT/JPT approval before commit/push/deploy

## Risk Register

| Risk | Mitigation |
| --- | --- |
| CSV structure change breaks parser | Require structure-change proposal, parser guard update, fixture coverage, and rollback note. |
| URL changes silently fail | Require URL review, cache-busted smoke, fetch-failure fallback check, and owner confirmation. |
| Staff mistake sample cards/charts as official CSV totals | Keep visible boundary wording and do not make cards/charts CSV-driven without a separate phase. |
| Row count mismatch | Record expected row-count range, compare opening/during/closing snapshots, and escalate suspicious changes. |
| Missing values treated as zero | Keep parser guard coverage for missing vs zero and reject wording that implies blanks/dashes are zero. |
| Fetch failure not understood by staff | Keep source-note wording visible and maintain fallback instructions in operating docs. |
| Browser cache confusion | Use cache-busted smoke checks and document final URL/CF cache state where visible. |
| Future dashboard totals drift from official formula | Keep formula tests and review all future card/chart integrations against `systemSales + outsideSystemSales`. |

## Recommended Next Step

Review this planning document first.

Then choose whether to create a detailed CSV governance policy or a Dashboard CSV surface integration proposal.

Keep controlled use running while planning production integration.

## Guardrails Preserved

- No code changes
- No parser changes
- No CSV behavior changes
- No live CSV URL changes
- No daily table gate changes
- No dashboard hero/cards/charts changes
- No backend/Auth/Firebase/API
- No AI/Chat/Stock/OCR/Loan Calculator
- No PDF/Excel/file export
- No dependency/tooling changes
- No deploy
