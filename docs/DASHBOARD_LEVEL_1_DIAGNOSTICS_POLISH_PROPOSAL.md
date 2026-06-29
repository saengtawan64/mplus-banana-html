# Dashboard Level 1 Diagnostics Polish Proposal

Status: proposed planning-only Level 1 polish

Latest baseline commit: `410b3c4 docs: add csv production governance readiness pack`

Scope: Dashboard diagnostics/readability polish only

Implementation status: not approved

## Baseline

Level 0 controlled use is approved.

Current stable state:

- Dashboard daily table may be CSV-backed only when `Parser: ok`.
- Current normal state: Fetch success / Parser ok / `372` rows.
- Current fallback state: fetch failure returns sample/fallback daily table with `8` rows.
- Hero/cards/charts remain sample/prototype.
- CSV ยอดรวม remains cross-check/validation only, not official total.
- Official total remains `systemSales + outsideSystemSales`.
- No current P0/P1/P2/P3 blocking issues.

## Level 1 Polish Goals

Level 1 should improve diagnostics clarity without changing core behavior.

Goals:

- Make CSV status easier to read.
- Make row count easier to verify.
- Make source note harder to misunderstand.
- Make fallback/sample state more obvious.
- Improve staff/owner confidence without changing behavior.
- Preserve the daily-table-only CSV boundary.

## Proposed Polish Areas

### CSV Preview Status Text

Clarify the overall state in a compact, staff-readable format.

The status should separate:

- Fetch status
- Parser status
- Draft row count
- Warnings
- Errors
- Last checked time
- Daily-table-only boundary

### Fetch / Parser / Draft Rows / Warnings / Errors Visibility

Make the current diagnostic values easier to scan.

Suggested display hierarchy:

- CSV readiness state
- Fetch status
- Parser status
- Draft rows
- Warnings
- Errors
- Last check time

The display should not imply that CSV powers hero/cards/charts.

### Daily Table Source Note

The source note should clearly say whether the daily table is CSV-backed or sample-backed.

It should remain close to the daily table and avoid broad wording that could be read as applying to the whole Dashboard.

### Daily Table Row Count Display

Show a staff-readable row count for the daily table state.

Examples:

- CSV-backed state: `372` rows
- Fallback/sample state: `8` rows

The row count should support verification but should not be described as an official sales total.

### Fallback/Sample Wording

Fallback wording should calmly explain that the daily table returned to sample data when CSV fetch/parser is not usable.

It should avoid panic language and should give the owner/staff a clear next action: do not rely on the CSV-backed daily table until the status returns to ok.

### Mobile Layout/Readability

At `390x844`, diagnostics should remain readable without page-wide overflow.

Suggested mobile priorities:

- CSV state first
- Parser status and row count early
- Warnings/errors readable
- Daily table source note visible before table rows
- Long explanatory text wraps cleanly

### Mapping Cross-Reference Wording

If a Mapping cross-reference is used, it should reinforce that Mapping remains readiness-only.

It should not imply that production CSV import or live CSV structure editing is active.

### Staff-Facing Thai Explanation

Staff-facing text should be concise and practical.

It should say what is safe to trust, what remains sample/prototype, and what to do when CSV is unavailable.

## Proposed Wording Direction

These are wording ideas only, not implementation approval.

Possible Thai wording examples:

- `สถานะ CSV: ใช้งานได้`
- `Parser: ok`
- `จำนวนแถว CSV: 372`
- `ตารางรายวันกำลังใช้ข้อมูล CSV`
- `หาก CSV โหลดไม่สำเร็จ ระบบจะแสดงตารางตัวอย่างแทน`
- `การ์ดและกราฟยังเป็นข้อมูลตัวอย่าง ไม่ใช่ยอดจริงจาก CSV`

Possible English support labels:

- `Daily table only`
- `CSV checked`
- `Sample fallback`
- `Cards/charts remain prototype`

Any final wording should be reviewed in the actual UI before approval.

## Non-Goals

This proposal does not approve:

- Changing parser logic
- Changing live CSV URL
- Changing fetch behavior
- Changing daily table gate behavior
- Making hero/cards/charts CSV-driven
- Changing official total formula
- Backend/Auth/Firebase/API
- AI/chat/stock/OCR/loan calculator
- PDF/Excel/file export
- Deployment

## Acceptance Criteria For Future Implementation

Any future Level 1 implementation must meet all of the following:

- Parser guard still passes `52/52`.
- Daily table remains CSV-backed only when `Parser: ok`.
- Fetch failure still restores sample/fallback daily table.
- Fallback row count remains visible.
- Source note is not misleading.
- Hero/cards/charts still clearly remain sample/prototype.
- Mobile `390x844` has no page-wide overflow.
- No blocking console errors.
- No change to official formula.

## Required QA Before Future Implementation Approval

Required checks:

- Local parser guard
- Dashboard live smoke
- Cache-busted Dashboard smoke
- Mapping smoke
- Mobile smoke
- Fallback simulation or fallback verification
- Source note check
- Row count check
- No source behavior changes unless explicitly approved

## Risk Register

| Risk | Mitigation |
| --- | --- |
| Wording implies cards/charts are CSV-backed | Keep explicit daily-table-only language beside the CSV status and source note. |
| Source note becomes misleading | Keep source note scoped to the daily table, not the whole Dashboard. |
| Too much status text becomes unreadable on mobile | Prioritize status, parser, row count, warnings/errors, then secondary explanation. |
| Row count displayed but not understood | Label it as row count only, not as a sales total. |
| Fallback wording causes panic | Use calm wording that says sample fallback is expected when CSV fails. |
| Diagnostics polish accidentally changes behavior | Keep implementation scoped to wording/layout only and verify parser/live gate behavior before approval. |

## Recommended Next Step

Review this proposal first.

Then create a narrow implementation proposal for diagnostics wording/layout only.

Keep behavior unchanged.

Do not start cards/charts CSV work yet.

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
