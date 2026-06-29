# Contextual CSV Fixture Test Spec

## Status

- Documentation-only.
- Proposal/spec for future local parser testing.
- No app connection approved.
- No live CSV connection approved.
- No parser implementation approved.

> Historical note: this document was written before the current contextual parser readiness guard and daily-table-only preview gate were implemented. Current operating policy is documented in `DASHBOARD_CSV_DATA_SOURCE_POLICY.md` and `CSV_MVP_OPERATING_CHECKLIST_AND_UAT.md`.

## Current Confirmed Owner Decisions

- `ยอดในระบบ > รวมยอด` = official `systemSales`.
- `ยอดนอกระบบ > รวมยอด` = official `outsideSystemSales`.
- CSV `ยอดรวม` = validation/cross-check only.
- `สญ` = `contractCount`.
- Use year from month rows.
- If title year conflicts with month-row year, stop before app connection.
- Monthly `รวม` rows are excluded.
- Blank/separator rows are skipped.
- `-` = missing/not applicable, not zero.
- Future placeholder zero rows = `ยังไม่มีข้อมูล`, not true zero sales.

## Business Rules

- `totalSales = systemSales + outsideSystemSales`.
- Finance / contract / profit are supporting metrics only.
- Missing data must remain separate from zero.
- Real numeric `0` is valid only for active real data rows.
- CSV `ยอดรวม` must never replace calculated total.

## Proposed Tiny Fixture Shape

Use invented safe numbers only. Do not copy sensitive real sales data into the fixture.

The future fixture should be small but representative enough to prove contextual header mapping, daily row classification, zero handling, dash handling, and summary-row exclusion.

```csv
,2,ยอดขายรวม บานาน่าลานสัก ปี 2568,,,,,,,,ประเภทสินเชื่อ
,,ยอดในระบบ,,,,ยอดนอกระบบ,,,,SG
\,วันที่,OPPO,จำนวน,รวมยอด,จำนวนโทรศัพท์,ค่าทำสัญญา,FOCUS,รวมยอด,ยอดรวม,ยอดจัด,สญ,กำไร
เดือน มกราคม 2569,1,,,1000,1,,200,1200,5000,1,100
,2,,,800,1,,300,1100,0,0,80
,3,,,0,0,,150,150,0,0,0
,4,,,-,0,,100,,0,0,-
,รวม,,,1800,2,,750,2550,5000,1,180
,,,,,,,,,,,,
เดือน กรกฎาคม 2569,1,,,0,0,,0,0,0,0,0
```

Fixture row coverage:

- Title row.
- Section header row.
- Field label row.
- One month marker row.
- Two active daily rows.
- One daily row with real zero.
- One row with `-`.
- One monthly `รวม` row.
- One blank/separator row.
- One future placeholder zero row.

## Expected Normalized Output

### Active Daily Row

The first active daily row should normalize into an active data row.

```js
{
  date: "2026-01-01",
  systemSales: 1000,
  outsideSystemSales: 200,
  totalSales: 1200,
  deviceCount: 1,
  financeAmount: 5000,
  contractCount: 1,
  profit: 100,
  csvTotalCrossCheck: 1200,
  validationStatus: "ok",
  dataState: "active",
  sourceMonthLabel: "เดือน มกราคม 2569",
  sourceRowNumber: 4
}
```

### Second Active Daily Row

The second active daily row should normalize normally, including supporting metrics that are zero.

```js
{
  date: "2026-01-02",
  systemSales: 800,
  outsideSystemSales: 300,
  totalSales: 1100,
  deviceCount: 1,
  financeAmount: 0,
  contractCount: 0,
  profit: 80,
  csvTotalCrossCheck: 1100,
  validationStatus: "ok",
  dataState: "active",
  sourceMonthLabel: "เดือน มกราคม 2569",
  sourceRowNumber: 5
}
```

### Real Zero Row

The real zero row should preserve numeric `0` for `systemSales` because the row is an active real data row, not future/no-data.

```js
{
  date: "2026-01-03",
  systemSales: 0,
  outsideSystemSales: 150,
  totalSales: 150,
  deviceCount: 0,
  financeAmount: 0,
  contractCount: 0,
  profit: 0,
  csvTotalCrossCheck: 150,
  validationStatus: "ok",
  dataState: "active",
  sourceMonthLabel: "เดือน มกราคม 2569",
  sourceRowNumber: 6
}
```

### Dash / Missing Row

The row containing `-` should not convert `-` into `0`. Required missing sales values should mark the row as missing/incomplete.

```js
{
  date: "2026-01-04",
  systemSales: null,
  outsideSystemSales: 100,
  totalSales: null,
  deviceCount: 0,
  financeAmount: 0,
  contractCount: 0,
  profit: null,
  csvTotalCrossCheck: null,
  validationStatus: "missingRequiredField",
  dataState: "missing",
  sourceMonthLabel: "เดือน มกราคม 2569",
  sourceRowNumber: 7
}
```

### Monthly `รวม` Row Excluded

The monthly `รวม` row should not produce a normalized daily row.

Expected behavior:

```text
excluded: true
reason: monthlySummaryRow
```

### Blank Row Skipped

The blank/separator row should be skipped.

Expected behavior:

```text
skipped: true
reason: blankRow
```

### Future Placeholder Zero Row As `noData`

The future placeholder zero row should not become a real active zero sales row.

```js
{
  date: "2026-07-01",
  systemSales: null,
  outsideSystemSales: null,
  totalSales: null,
  deviceCount: null,
  financeAmount: null,
  contractCount: null,
  profit: null,
  csvTotalCrossCheck: null,
  validationStatus: "futurePlaceholder",
  dataState: "noData",
  sourceMonthLabel: "เดือน กรกฎาคม 2569",
  sourceRowNumber: 10
}
```

## Validation Cases

- Calculated total equals CSV cross-check total.
- Calculated total mismatch creates warning only.
- Missing required field.
- Invalid date.
- Duplicate ambiguous header.
- Title-year vs month-row-year conflict.

### Calculated Total Equals CSV Cross-Check Total

Given:

```text
systemSales = 1000
outsideSystemSales = 200
csvTotalCrossCheck = 1200
```

Expected:

```text
totalSales = 1200
validationStatus = ok
```

### Calculated Total Mismatch Creates Warning Only

Given:

```text
systemSales = 1000
outsideSystemSales = 200
csvTotalCrossCheck = 1250
```

Expected:

```text
totalSales = 1200
validationStatus = totalMismatch
```

The CSV cross-check total must not replace the calculated total.

### Missing Required Field

If `systemSales` or `outsideSystemSales` is blank, `-`, or unavailable on an active row:

```text
validationStatus = missingRequiredField
dataState = missing
```

The missing value must not become zero.

### Invalid Date

If the day value is not a valid day number or the row has no usable month context:

```text
validationStatus = invalidDate
dataState = invalid
```

### Duplicate Ambiguous Header

If duplicate `รวมยอด` columns cannot be resolved by section context:

```text
validationStatus = ambiguousHeader
parserStatus = stop
```

### Title-Year Vs Month-Row-Year Conflict

If the title year and month-row year conflict:

```text
validationStatus = yearConflict
parserStatus = stopBeforeAppConnection
```

The future parser must not silently choose one year when the conflict is unresolved.

## Future Test Assertions

- `systemSales + outsideSystemSales === totalSales`.
- CSV total is never used as source total.
- `-` never becomes `0`.
- Blank never becomes `0`.
- Real active `0` remains `0`.
- Future placeholder `0` row becomes `noData`.
- Monthly `รวม` rows are excluded.
- Blank/separator rows are skipped.
- Duplicate ambiguous headers fail safely.
- Year conflict fails safely.
- Finance amount remains supporting only.
- Contract count remains supporting only.
- Profit remains supporting only.

## Future Files, Not Created Yet

These files are future-only and are not approved in this documentation pass:

```text
tests/fixtures/lansak-contextual-sample.csv
tests/contextual-csv-mapping.test.js
```

Manual-test alternative if test tooling is not approved:

```text
docs/contextual-csv-manual-test-cases.md
tests/manual/contextual-csv-expected-output.json
```

No test files, fixture CSV files, expected-output JSON files, package files, test tooling, or parser code are created by this spec.

## Stop Conditions

Stop future implementation if:

- Fixture accidentally includes sensitive real data.
- Adding tests would require package/build tooling that is not approved.
- Parser cannot distinguish future placeholder zeroes from active zeroes.
- Year conflict behavior is not resolved.
- Duplicate `รวมยอด` cannot be resolved by section context.
- Validation starts using CSV `ยอดรวม` as source total.
- Missing values convert to zero.
- Live CSV connection is implied before approval.
- Finance, contract count, or profit are mixed into `totalSales`.
- Dashboard/report/compare behavior would change before parser review approval.

## Next Phase

Recommended next phase:

1. GPT/JPT reviews this spec.
2. If approved, Codex may later propose a tiny local fixture file.
3. Any later fixture/parser work should remain local-only until separately approved.
4. Still no live CSV connection.
