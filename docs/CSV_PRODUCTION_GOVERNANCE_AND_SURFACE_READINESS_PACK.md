# CSV Production Governance and Surface Readiness Pack

Status: proposed planning-only governance pack

Latest baseline commit: `b2c9370 docs: add csv production integration planning`

Scope: governance, live URL policy, ownership, approval gates, dashboard surface readiness

Production implementation status: not approved

## Baseline And Protected Current State

Controlled CSV MVP is ready for continued controlled use.

Current approved integration is Level 0 only: Dashboard daily table CSV-backed when `Parser: ok`.

Protected current state:

- Normal CSV state: `372` preview rows / `372` daily rows.
- Fetch failure returns sample/fallback daily table with `8` rows.
- P3 fetch-failure simulation is CLOSED.
- Hero/cards/charts remain sample/prototype.
- Mapping remains readiness-only.
- CSV ยอดรวม is cross-check/validation only, not official total.
- Official total remains `systemSales + outsideSystemSales`.
- P0/P1/P2/P3 blocking issues: none.
- No behavior changes are approved by this document.

## CSV Governance Policy Draft

| Role | Proposed owner |
| --- | --- |
| CSV Owner | Owner decision required |
| CSV Editor | Owner decision required |
| CSV Structure Approver | Owner/GPT-JPT review required |
| Live URL Approver | Owner/GPT-JPT review required |
| Parser/Data Validation Reviewer | GPT/JPT + optional Gemini/Claude review |
| Rollback Owner | Owner decision required |

Governance rules:

- CSV structure changes require a proposal before change.
- Column changes require parser impact review.
- Row-count changes should be explained when materially different.
- Summary/รวม rows must not become daily sales rows.
- Missing/dash/`—` must remain distinct from zero.
- CSV ยอดรวม remains cross-check only.

## Live CSV URL Policy

The current live CSV URL must not change without review.

Any URL change requires:

- Reason for change
- Old URL reference
- New URL proposal
- Expected row count
- Cache-busted smoke test
- Fallback test
- Rollback plan
- Owner approval
- GPT/JPT approval before commit/push/deploy

URL change boundaries:

- URL changes must not be bundled with parser/dashboard behavior changes unless explicitly approved.
- URL changes must not be bundled with hero/cards/charts CSV integration.

## Data Ownership And Source-Of-Truth Policy

- Official total formula remains `systemSales + outsideSystemSales`.
- CSV ยอดรวม is diagnostic cross-check only.
- Any change to official total formula requires separate business approval.
- Finance / contract / profit remain supporting metrics only.
- Staff Targets remain branch-level only, not personal sales, commission, payroll, HR, or ranking.
- Owner decision is required for the official source of truth if a future backend/database is introduced.

## Dashboard Surface Readiness Ladder

| Level | Scope | Required approval | Required QA | Rollback/fallback expectation |
| --- | --- | --- | --- | --- |
| Level 0 — Current controlled use | Daily table only | Already approved | Parser ok required, live smoke, fallback proof | Fetch/parser failure restores sample daily table |
| Level 1 — Daily table diagnostics polish | Planning allowed; diagnostics and wording only | Full diff review before implementation | Parser guard, live smoke, cache-busted smoke, mobile smoke, fallback check | Must preserve current daily-table gate and sample fallback |
| Level 2 — Summary cards CSV readiness | Planning only; limited future summary card CSV design | Separate owner approval and formula audit | Parser guard, official formula audit, fixture coverage, live smoke, mixed-state review | Cards must fall back safely and never override official formula |
| Level 3 — Charts CSV readiness | Planning only; selected future chart CSV design | Separate owner approval and chart mapping approval | Chart data mapping, fallback behavior, mobile QA, no-overflow check | Charts must fail safely without blanking core dashboard |
| Level 4 — Production dashboard integration | Not approved | Production integration approval package, rollback plan, owner acceptance | Full regression, live smoke, mobile smoke, fallback test, owner UAT | Explicit rollback path required before release |

No level above Level 0 is implementation-approved by this document.

## Approval Gates

Before any implementation:

1. Proposal
2. Exact file scope
3. Full diff/full content
4. Parser guard `52/52` or updated approved guard
5. Live smoke test
6. Cache-busted smoke test
7. Mobile smoke test
8. Fallback test
9. Owner acceptance
10. GPT/JPT approval before staging/commit/push/deploy

## Risk Register

| Risk | Mitigation |
| --- | --- |
| CSV owner unclear | Assign CSV Owner before production integration and document escalation path. |
| CSV structure changes break parser | Require structure-change proposal, parser impact review, fixture update, and parser guard run. |
| Live URL silently fails | Require URL proposal, cache-busted smoke, fallback test, and rollback note before approval. |
| Staff confuse sample cards/charts with official CSV totals | Keep visible boundary wording and avoid cards/charts CSV integration until separately approved. |
| Row count changes unexpectedly | Define expected variance, record row counts in snapshots, and escalate unexplained changes. |
| Missing/dash values become zero | Keep parser guard coverage and require review for any missing/zero handling changes. |
| Future card/chart totals drift from official formula | Require formula audit and explicit comparison against `systemSales + outsideSystemSales`. |
| Cache confusion after URL or CSV changes | Use cache-busted smoke checks and document final URL/CF cache state when visible. |
| Rollback owner unclear | Assign Rollback Owner before production integration or live URL change approval. |

## Decision Questions For Owner

Owner decision required:

- Who owns the CSV?
- Who can edit CSV structure?
- Who can change the live URL?
- What row-count variance is normal?
- How often will CSV be updated?
- What is the rollback process?
- When should cards/charts become CSV-driven?
- Is CSV still enough, or should backend/database planning begin?

## Recommended Next Step

Review this governance pack first.

Then choose one:

A. Continue controlled use only.

B. Create detailed Live CSV URL Change Procedure.

C. Create Dashboard Surface Level 1 Diagnostics Polish Proposal.

D. Create CSV production integration approval package.

Recommendation: choose B or C before any cards/charts CSV implementation.

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
