# Dashboard Level 1 Diagnostics Polish Implementation Proposal

Status: proposed implementation plan, not approved for code changes

Latest baseline commit: `c7c8c06 docs: add dashboard level 1 diagnostics polish proposal`

Scope: Dashboard diagnostics wording/layout polish only

Implementation status: not approved

## Proposed Implementation Scope

Future candidate files likely needed:

- `dashboard.html`
- `css/style.css`
- `js/live-csv-preview.js`

Inspection note:

- `js/dashboard.js` is not proposed for Level 1 diagnostics polish. Current Dashboard sample data/card/chart behavior should remain untouched.

Explicit scope boundaries:

- No parser file changes proposed.
- No live CSV URL changes proposed.
- No daily table gate behavior changes proposed.
- No hero/cards/charts CSV changes proposed.
- No dashboard calculations changes proposed.

## Current UI Diagnostics Problem

Current behavior is correct and must be preserved.

Current diagnostics clarity issues:

- CSV preview status text is long.
- Important values are present but hard to scan.
- Staff may need clearer row count/source/fallback wording.
- Mobile readability should be protected.
- The daily table source note is correct, but future polish can make the state easier to verify.
- The CSV boundary is visible, but future polish can make it shorter and more action-oriented.

## Proposed UI Polish Design

Use a compact diagnostics block with clear groups:

- CSV readiness state
- Fetch status
- Parser status
- CSV rows / daily rows
- Warnings / Errors
- Last checked time
- Daily-table-only boundary
- Fallback explanation

Layout direction:

- Desktop: compact grouped chips/cards or short rows inside the existing CSV preview panel.
- Mobile `390x844`: diagnostics wrap cleanly with no page-wide overflow.
- Daily table source note remains near the daily table.
- Boundary text remains visible but not too long.
- Mapping cross-reference, if added, should point to readiness-only context and not imply production import.

## Proposed Wording

These are wording candidates only. They do not approve implementation.

### Normal CSV-Backed State

- `สถานะ CSV: ใช้งานได้`
- `Fetch: success`
- `Parser: ok`
- `จำนวนแถว CSV: 372`
- `ตารางรายวัน: ใช้ข้อมูล CSV ตรวจสอบแล้ว`
- `ขอบเขต: CSV ใช้เฉพาะตารางรายวัน`
- `การ์ด/กราฟยังเป็นข้อมูลตัวอย่าง`

### Fallback/Sample State

- `สถานะ CSV: โหลดไม่สำเร็จ`
- `ตารางรายวัน: แสดงข้อมูลตัวอย่างแทน`
- `จำนวนแถวตัวอย่าง: 8`
- `หากต้องการใช้ CSV ให้ตรวจสอบการเชื่อมต่อ/ไฟล์ CSV แล้วโหลดใหม่`
- `การ์ด/กราฟยังเป็นข้อมูลตัวอย่าง`

### Boundary Wording

- `CSV ใช้เฉพาะตารางรายวันเมื่อ Parser: ok`
- `CSV ยอดรวมใช้ตรวจสอบเท่านั้น ไม่ใช่ยอดรวมทางการ`
- `ยอดรวมทางการ = ยอดในระบบ + ยอดนอกระบบ`

## Behavior Preservation Requirements

Future implementation must preserve:

- Parser ok gate.
- CSV-backed daily table only when `Parser: ok`.
- Fetch/parser failure fallback to sample daily table.
- Fallback row count `8`.
- Normal row count `372` when current CSV loads.
- Source note accuracy.
- Hero/cards/charts sample/prototype state.
- Official total formula.
- Missing/dash/`—` is not zero.
- No live CSV URL change.

## Exact Acceptance Criteria

Future implementation must meet all criteria:

- Parser guard passes `52/52`.
- Normal Dashboard shows Fetch success / Parser ok.
- Normal preview rows: `372`.
- Normal daily table rows: `372`.
- Normal source note remains correct or clearer.
- Blocked CSV request fallback still shows sample daily table with `8` rows.
- Parser does not falsely report ok on failed fetch.
- Daily table is never blank in fallback.
- Hero/cards/charts remain sample/prototype.
- Mobile `390x844` has no page-wide overflow.
- No blocking console errors.
- No live URL change.

## QA Plan For Future Implementation

Required commands/checks:

```powershell
git status --short
node --check js/live-csv-preview.js
node --check js/dashboard.js
node tests/contextual-csv-parser-readiness.mjs
git diff --check
```

Browser/live checks:

- Dashboard live smoke.
- Dashboard cache-busted smoke.
- Mapping smoke.
- Mobile `390x844` smoke.
- P3-style targeted CSV request block fallback check.
- Post-restore CSV-backed check.
- Source note check.
- Row count check.
- No source behavior changes unless explicitly approved.

## Risk And Mitigation

| Risk | Mitigation |
| --- | --- |
| Wording accidentally implies cards/charts are CSV-backed | Keep explicit `CSV ใช้เฉพาะตารางรายวัน` wording near status and source note. |
| Staff mistakes row count for sales total | Label row count as `จำนวนแถว`, never as total sales. |
| Fallback wording causes panic | Use calm wording that sample fallback is expected when CSV fails. |
| Mobile overflow | Use compact chips/short rows, wrapping text, and mobile smoke at `390x844`. |
| Implementation accidentally changes behavior | Limit changes to wording/layout and run parser/live/fallback checks. |
| Source note becomes too broad | Keep source note scoped to daily table only. |
| Status text becomes too long again | Split diagnostics into grouped short values instead of one long sentence. |

## Future Implementation Stop Point

After this proposal is reviewed, any future implementation must:

- Return exact file scope.
- Return full diff.
- Run QA.
- Stop before commit.
- Wait for GPT/JPT approval.

## Non-Goals

This proposal does not approve:

- Code changes now
- Parser changes
- Live CSV URL changes
- Fetch behavior changes
- Daily table gate changes
- Cards/charts CSV integration
- Official formula changes
- Backend/Auth/Firebase/API
- AI/chat/stock/OCR/loan calculator
- PDF/Excel/file export
- Deploy

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
