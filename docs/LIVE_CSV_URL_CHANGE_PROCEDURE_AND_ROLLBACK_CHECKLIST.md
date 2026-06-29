# Live CSV URL Change Procedure and Rollback Checklist

Status: proposed procedure only  
Latest baseline commit: `a2ba804 docs: close dashboard level 1 diagnostics polish`  
Scope: future live CSV URL governance and rollback procedure  
Implementation status: no URL change approved

## Purpose

The live CSV URL is part of the controlled CSV MVP safety boundary. Changing it can affect fetch status, parser status, row counts, fallback behavior, and staff trust in the Dashboard.

Any future URL change must be reviewed separately. It must not be bundled with parser changes, Dashboard behavior changes, card/chart integration, formula changes, backend work, export behavior, or any unrelated feature work unless the owner and GPT/JPT explicitly approve a combined package.

## Protected Current State

The current controlled CSV MVP state remains protected:

- Current live CSV URL remains unchanged.
- Dashboard daily table may be CSV-backed only when Parser is ok.
- Normal expected state is 372 preview rows / 372 daily rows.
- Normal source note is `ตารางรายวัน: ใช้ข้อมูล CSV ตรวจสอบแล้ว | จำนวนแถว CSV: 372`.
- Fallback expected state is 8 sample rows.
- Fallback source note is `ตารางรายวัน: แสดงข้อมูลตัวอย่างแทน | จำนวนแถวตัวอย่าง: 8`.
- Hero/cards/charts remain sample/prototype.
- CSV `ยอดรวม` remains cross-check only, not official total.
- Official total remains `systemSales + outsideSystemSales`.

## URL Change Proposal Requirements

Any future live CSV URL change proposal must include:

- Reason for URL change.
- Old URL reference.
- New URL reference.
- Expected CSV owner.
- Expected row count.
- Expected column/header structure.
- Whether CSV structure changed.
- Rollback URL.
- Rollback owner.
- Test window.
- Owner approval.
- GPT/JPT review before implementation.

## Non-Bundling Rules

URL changes must not be bundled with the following unless the owner and GPT/JPT explicitly approve a combined package:

- Parser changes.
- Dashboard behavior changes.
- Daily table gate changes.
- Hero/cards/charts CSV integration.
- Official formula changes.
- Backend/Auth/Firebase/API.
- Export/PDF/Excel behavior.
- AI/Chat/Stock/OCR/Loan Calculator.
- Dependency/CDN/font/package/tooling changes.

## Pre-Change Checklist

Before any future URL change implementation:

- Confirm `git status --short` is clean.
- Confirm current Dashboard smoke passes.
- Confirm current cache-busted Dashboard smoke passes.
- Confirm current Mapping smoke passes.
- Confirm parser guard passes `52/52`.
- Confirm current fallback behavior is understood.
- Document rollback URL.
- Document rollback steps.
- Capture owner approval.
- Select implementation window.
- Confirm GPT/JPT review is required before commit, push, or deploy.

## Proposed Implementation Gate For Future URL Change

Expected file scope for a URL-only change is likely:

- `js/live-csv-preview.js`

Implementation gate:

- Full diff is required.
- Confirm only the URL constant changed if that is the only intended change.
- Confirm no parser behavior changed.
- Confirm no Dashboard behavior changed.
- Confirm no daily table gate behavior changed.
- Confirm no hero/cards/charts behavior changed.
- Stop before commit.
- GPT/JPT review is required before commit, push, or deploy.

If any change beyond the URL constant is required, the implementation must stop and return a new proposal explaining why the wider scope is needed.

## Post-Change Smoke Checklist

After a future approved URL change, verify:

- Dashboard returns HTTP 200.
- Cache-busted Dashboard returns HTTP 200.
- Fetch status is success.
- Parser status is ok.
- Preview row count matches expected row count or documented variance.
- Daily table row count matches expected row count or documented variance.
- Source note is correct and includes row count.
- Grouped diagnostics are visible.
- Mapping remains readiness-only.
- Mobile 390x844 has no page-wide overflow.
- No blocking console errors are present.
- Hero/cards/charts remain sample/prototype unless separately approved.

## Fallback Test Checklist

For a future approved URL change, verify fallback by blocking only the new exact CSV request:

- Block only the new exact CSV request.
- Confirm Dashboard still returns HTTP 200.
- Confirm fetch failure is visible.
- Confirm Parser does not falsely report ok.
- Confirm daily table fallback is not blank.
- Confirm fallback rows remain 8.
- Confirm fallback source note is clear.
- Confirm hero/cards/charts remain sample/prototype.
- Remove block.
- Confirm normal CSV-backed state restores.

## Rollback Checklist

Rollback should be considered when any of the following occur:

- Fetch fails unexpectedly.
- Parser is not ok.
- Row count is clearly wrong.
- Source note is misleading.
- Daily table is blank.
- Staff boundary confusion appears.
- Fallback behavior is broken.
- The new CSV owner or source of truth is unclear.

Rollback steps:

- Restore previous URL.
- Run parser guard.
- Run Dashboard smoke.
- Run cache-busted Dashboard smoke.
- Run fallback check.
- Confirm source note and row count.
- Document rollback result.
- Do not deploy unless separately approved.

## Approval And Reporting Template

Use this template for any future URL change proposal, implementation review, or rollback report:

```text
Proposed URL change:
- Old URL:
- New URL:
- Reason:
- CSV owner:
- Rollback URL:
- Rollback owner:

Expected data:
- Expected row count:
- Expected structure:
- Structure changed: yes/no

Pre-change checks:
- git status:
- Parser guard:
- Current Dashboard smoke:
- Current Mapping smoke:
- Owner approval:

Post-change results:
- Dashboard HTTP:
- Cache-busted Dashboard HTTP:
- Fetch status:
- Parser status:
- Preview rows:
- Daily table rows:
- Source note:
- Mobile 390x844:
- Console:

Fallback results:
- Exact request blocked:
- Fetch failure visible:
- Parser did not falsely report ok:
- Fallback rows:
- Fallback source note:
- Post-restore status:

Decisions:
- Rollback status:
- Owner decision:
- GPT/JPT decision:
- Final decision: approve / hold / rollback
```

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| New URL inaccessible | Require pre-change owner approval, post-change Fetch success check, and rollback URL. |
| CSV structure changed | Require expected header/column structure and parser guard review before approval. |
| Row count unexpected | Require expected row count and documented variance before accepting the change. |
| Cache confusion | Test both normal and cache-busted Dashboard routes. |
| Parser status not ok | Hold or rollback; do not treat the daily table as CSV-backed. |
| Staff think cards/charts are CSV-backed | Preserve visible boundary wording that hero/cards/charts remain sample/prototype. |
| Rollback URL missing | Do not approve the URL change until rollback URL and owner are documented. |
| Owner/source-of-truth unclear | Hold the change until CSV owner and source-of-truth are confirmed. |

## Guardrails Preserved

This procedure itself preserves all current guardrails:

- No code changes in this procedure.
- No parser changes.
- No CSV behavior changes.
- No live CSV URL changes.
- No daily table gate changes.
- No Dashboard hero/cards/charts changes.
- No backend/Auth/Firebase/API.
- No AI/Chat/Stock/OCR/Loan Calculator.
- No PDF/Excel/file export.
- No dependency/CDN/font/package/tooling changes.
- No deploy.

## Recommended Next Step

Review this procedure first.

Then continue controlled use under the current approved CSV MVP boundary.

If a real URL change is needed later, create a separate URL change proposal using this checklist. Do not begin Dashboard cards/charts CSV work until URL governance is accepted.
