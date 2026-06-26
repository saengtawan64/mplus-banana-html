# Contextual CSV Parser Design

## Status

- Documentation-only.
- Design proposal for future parser implementation.
- No parser code approved.
- No app connection approved.
- No live CSV connection approved.
- Current flat CSV mapping remains unchanged.

## Background

The current `js/csv-mapping.js` supports flat one-row-header CSV files only. It expects the first CSV row to contain usable column headers and then maps those headers to approved canonical fields.

The Lansak CSV is report-style/contextual rather than a flat one-row-header CSV. It uses row 2 as a section header row and row 3 as a field label row. Because labels such as `รวมยอด` appear more than once, the parser must use section context to identify the correct columns.

Month context and row classification are also required. Some rows introduce a month, some rows are daily sales rows, some rows are monthly summaries, some rows are blank separators, and some rows are future placeholder rows.

## Confirmed Owner Decisions

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
- CSV `ยอดรวม` must never replace calculated total.
- Finance / contract / profit are supporting metrics only.
- Missing data must remain separate from zero.
- Real numeric `0` is valid only for active real data rows.

## Proposed Future Parser File

Recommended future file:

```text
js/contextual-csv-mapping.js
```

This parser should remain separate from `js/csv-mapping.js`.

Reasons:

- `js/csv-mapping.js` is intentionally simple and flat-header based.
- The Lansak parser needs contextual header detection across section and field rows.
- The Lansak parser needs month-aware row classification.
- The Lansak parser needs validation and stop states that do not belong in the flat mapper.
- Keeping the modules separate reduces risk of breaking existing flat CSV behavior.

## Proposed Public API

These are conceptual APIs only. No implementation is approved in this document.

### `parseContextualSalesCsv(rowsOrText, options)`

Input:

- Raw CSV text or parsed CSV matrix.
- Optional settings such as expected branch, title-year policy, month-row year policy, and future-row handling.

Output:

```js
{
  status: "ok" | "warning" | "stop",
  mapping: {},
  rows: [],
  excludedRows: [],
  warnings: [],
  errors: []
}
```

Failure states:

- `unsupportedStructure`
- `ambiguousHeader`
- `yearConflict`
- `missingRequiredField`

Side-effect-free expectation:

- Pure function.
- No fetch.
- No DOM access.
- No app state mutation.

### `detectContextualMapping(rows, options)`

Input:

- Parsed CSV matrix.
- Optional row index configuration.

Output:

```js
{
  complete: true,
  columns: {
    systemSales: 4,
    outsideSystemSales: 8,
    deviceCount: 5,
    financeAmount: 10,
    contractCount: 11,
    profit: 12,
    csvTotalCrossCheck: 9
  },
  warnings: [],
  errors: []
}
```

Failure states:

- missing section header
- missing field label
- duplicate ambiguous header
- unsupported structure

Side-effect-free expectation:

- Pure function.
- No fetch.
- No DOM access.

### `normalizeContextualRows(rows, mapping, options)`

Input:

- Parsed CSV matrix.
- Contextual mapping output.
- Optional parsing settings.

Output:

```js
{
  rows: [],
  excludedRows: [],
  skippedRows: [],
  warnings: [],
  errors: []
}
```

Failure states:

- invalid date
- missing month context
- missing required field
- unsupported row shape

Side-effect-free expectation:

- Pure function.
- No fetch.
- No DOM access.

### `validateContextualTotals(rows, options)`

Input:

- Normalized daily rows.
- Optional tolerance setting.

Output:

```js
{
  rows: [],
  warnings: []
}
```

Failure states:

- `totalMismatch` warning when calculated total and CSV cross-check differ beyond tolerance.

Side-effect-free expectation:

- Pure function.
- Never replaces calculated total with CSV total.

## Normalized Row Output Shape

Each normalized daily row should have this conceptual shape:

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
  sourceRowNumber: 4,
  warnings: []
}
```

Fields:

- `date`: normalized Gregorian date string, such as `2026-01-01`.
- `systemSales`: value from `ยอดในระบบ > รวมยอด`.
- `outsideSystemSales`: value from `ยอดนอกระบบ > รวมยอด`.
- `totalSales`: calculated value only.
- `deviceCount`: supporting device count.
- `financeAmount`: supporting finance amount.
- `contractCount`: supporting contract count.
- `profit`: supporting profit.
- `csvTotalCrossCheck`: CSV total for validation only.
- `validationStatus`: row validation status.
- `dataState`: row data state.
- `sourceMonthLabel`: original month marker label.
- `sourceRowNumber`: original 1-based CSV row number.
- `warnings`: row-level warning messages or warning codes.

## Status/Error Model

Row-level statuses:

- `ok`
- `noData`
- `missingRequiredField`
- `totalMismatch`
- `invalidDate`
- `ambiguousHeader`
- `yearConflict`
- `unsupportedStructure`

Parser-level statuses:

- `ok`: parser found usable contextual mapping and usable rows.
- `warning`: parser found usable rows but non-blocking validation warnings exist.
- `stop`: parser found a blocking issue and output must not be connected to app views.

## Header Detection Design

- Row 2 = section header row.
- Row 3 = field label row.
- Carry section labels across columns until the next section label appears.
- Identify `ยอดในระบบ > รวมยอด` as `systemSales`.
- Identify `ยอดนอกระบบ > รวมยอด` as `outsideSystemSales`.
- Identify supporting fields:
  - `ยอดในระบบ > จำนวนโทรศัพท์` as `deviceCount`, if present.
  - `ยอดจัด` as `financeAmount`.
  - `สญ` as `contractCount`.
  - `กำไร` as `profit`.
- Identify `ยอดรวม` as `csvTotalCrossCheck` only.
- Fail safely on duplicate or ambiguous headers.

The parser should not rely on fixed column positions alone. It may use the approved fixture shape as a reference, but the mapping should be label/context driven.

## Row Classification Design

### Month Marker Rows

Rows where column 1 contains Thai month text and Buddhist year, such as:

```text
เดือน มกราคม 2569
```

The month marker row may also contain day `1` and sales data. If so, it should be treated as both a month context update and a daily row.

### Active Daily Rows

Rows with:

- valid current month context
- valid day number
- required sales fields available or intentionally numeric
- not monthly summary rows
- not blank/separator rows
- not future placeholder rows

### Real Zero Rows

Rows classified as active daily rows where a numeric `0` appears in sales/supporting fields. These zeroes remain valid numeric zeroes.

### Dash/Missing Rows

Rows where required fields contain `-`, blank, or invalid numeric text. These values become missing/not applicable, not zero.

### Monthly `รวม` Rows

Rows where the day column is `รวม`. These rows are excluded from normalized daily rows.

### Blank/Separator Rows

Rows where all meaningful cells are blank. These rows are skipped.

### Future Placeholder Zero Rows

Rows for future months where key sales fields are placeholder zeroes. These rows become:

```text
dataState = noData
validationStatus = futurePlaceholder
```

They must not become real active zero sales rows.

### Invalid Rows

Rows with unusable date context, invalid day values, unsupported shape, or unresolved required fields.

## Value/Date Parsing Design

### Comma Number Parsing

Values such as `16,999` should parse as `16999`.

### Blank Handling

Blank cells should become missing, not zero.

### Dash Handling

`-` should become missing/not applicable, not zero.

### Zero Handling

Numeric `0` should remain valid only when the row has already been classified as an active real data row.

### Future Placeholder Zero Handling

Future placeholder zero rows should become `noData`, not active zero sales rows.

### Baht/Currency Symbol Handling

If future source data includes currency text or symbols such as `฿` or `บาท`, the parser may strip those symbols before numeric parsing, after separate approval or review.

### Thai Month Parsing

The parser should map Thai month names to month numbers:

- มกราคม = 01
- กุมภาพันธ์ = 02
- มีนาคม = 03
- เมษายน = 04
- พฤษภาคม = 05
- มิถุนายน = 06
- กรกฎาคม = 07
- สิงหาคม = 08
- กันยายน = 09
- ตุลาคม = 10
- พฤศจิกายน = 11
- ธันวาคม = 12

### Buddhist Year To Gregorian Conversion

Convert Buddhist year to Gregorian year:

```text
gregorianYear = buddhistYear - 543
```

Example:

```text
2569 -> 2026
```

### Title-Year Vs Month-Row-Year Conflict

If title year and month-row year conflict, parser-level status should be:

```text
stop
```

The parser must stop before app connection and ask Owner for clarification.

## Validation Design

### Calculated Total Validation

The app total must always be calculated:

```text
totalSales = systemSales + outsideSystemSales
```

### CSV Total Cross-Check Warning Only

CSV `ยอดรวม` should be used only as `csvTotalCrossCheck`.

It may produce a warning if:

```text
abs(totalSales - csvTotalCrossCheck) > tolerance
```

### Tolerance Recommendation

Recommended tolerance:

```text
absolute difference <= 1 baht
```

### Never Replace Calculated Total

The parser must never replace `totalSales` with CSV `ยอดรวม`.

## Integration Boundary

- Current flat CSV mapping remains untouched.
- Contextual parser is opt-in for Lansak/report-style sheets only.
- Dashboard/report/compare must not use live CSV until separately approved.
- `mapping.html` may later show contextual mapping status, but not now.
- Warnings must remain visible.
- Sample/prototype warnings must remain visible until real connection is separately approved.
- No Firebase/Auth/backend/API is involved.
- No PDF/Excel export is involved.

## Test Approach

- Manual fixture review first.
- Future browser-console/manual parser check may be proposed later.
- Future minimal test file may be proposed only if approved later.
- No test framework/package tooling yet.
- No `package.json` is approved.

Future-only possible file:

```text
tests/contextual-csv-mapping.test.js
```

No such file is approved by this design document.

## Risks And Stop Conditions

Stop future implementation if:

- Duplicate contextual headers remain unresolved.
- Title year and month-row year conflict.
- Future placeholder zero detection is unreliable.
- Missing values become zero.
- CSV `ยอดรวม` replaces calculated total.
- Supporting metrics are mixed into total sales.
- Parser requires a live CSV URL.
- Parser changes dashboard behavior before approval.
- Parser requires package/test tooling before approval.
- Live CSV connection is implied before approval.

## Recommended Next Phase

Recommended next phase:

1. GPT/JPT reviews this design doc.
2. If approved, next phase may be parser skeleton proposal only.
3. Still no live CSV connection.
