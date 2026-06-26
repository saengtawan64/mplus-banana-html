# Contextual Parser Smoke Check and QA Plan

## Status

Status: review-only parser smoke check passed.

Tested commit:

```text
2e0f0d0 feat: add review-only contextual parser orchestration
```

Scope:

```text
Manual local smoke check only.
No deploy performed.
No app integration performed.
```

## Files Used

```text
tests/fixtures/lansak-contextual-sample.csv
js/contextual-csv-mapping.js
```

## Smoke Check Method

The smoke check used a one-off Node inline script.

The script:

- read the local fixture file
- converted the CSV fixture into a rows array manually
- called `parseContextualSalesCsv(rowsArray)`
- checked the text input path with `parseContextualSalesCsv("a,b\n1,2")`
- printed selected review-only output fields
- wrote no files

No test tooling was added.

## Smoke Check Result Summary

```text
PASS
result.status: warning
result.reviewOnly: true
result.inputType: rows
result.mapping.status: warning
result.normalized.status: warning
result.rows.length: 4
text input: stop / inputType text / not parsed
fixture modified: no
working tree after: clean
```

The warning status is expected at this review-only phase because the fixture includes a candidate before month context and the parser still reports review conditions.

## Summary Objects Confirmed Present

The orchestration output includes these review-only summary objects:

- `salesPreviewSummary`
- `draftRowsSummary`
- `totalSalesSummary`

## Guardrails Confirmed

The smoke check confirmed:

- no file changes
- no live CSV/fetch
- no dashboard/report/compare integration
- no Firebase/Auth/backend/API
- no AI/Chat/Stock/PDF/Excel
- no cross-row sales sums or financial aggregates
- no CSV `ยอดรวม` used as official total
- no `csvTotalCrossCheckColumn` values read
- no finance/contract/profit in official sales
- text CSV input still returns STOP
- output rows remain review-only draft rows

## Current Parser Meaning

The current parser state means:

- rows-array orchestration works in review-only mode
- mapping and normalization chain can run on fixture rows
- draft rows are not production data
- `totalSales` exists only as a row-level review-only draft value
- text CSV input is intentionally not parsed yet
- warning status is expected because fixture data includes review-only edge conditions

The parser output is not connected to dashboard, reports, compare, export, or live CSV.

## Remaining QA Plan

Before CSV text parsing, live CSV use, or dashboard integration, cover these QA cases:

- duplicate required header
- missing `วันที่`
- missing `ยอดในระบบ > รวมยอด`
- missing `ยอดนอกระบบ > รวมยอด`
- invalid Thai month marker
- daily row before month context
- missing system sales
- missing outside system sales
- `0 + 0` valid zero case
- `1000 + 0` valid mixed zero case
- text CSV parser local-only proposal
- CSV text parser QA
- live CSV fetch proposal later
- dashboard integration proposal later

## Hard Not-Yet-Approved Items

These are not approved yet:

- no live CSV URL integration
- no dashboard replacement with parser data
- no CSV text parser yet
- no validation against CSV `ยอดรวม`
- no production financial reporting
- no deploy

## Recommended Next Step

Review this document.

If approved, the next safe step is documentation-only commit of this file.

After that, the next technical proposal should be a local-only CSV text parser plan, still without live CSV integration.
