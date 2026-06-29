import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DATA_STATE,
  PARSER_STATUS,
  ROW_STATUS,
  parseContextualSalesCsv,
  validateContextualTotals,
} from "../js/contextual-csv-mapping.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(__dirname, "fixtures/lansak-contextual-sample.csv");
const fixtureCurrentDate = "2026-06-29";

const checks = [];

function recordCheck(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
}

function assertEqual(name, actual, expected) {
  recordCheck(name, Object.is(actual, expected), `expected ${String(expected)}, got ${String(actual)}`);
}

function assertTruthy(name, value, detail = "") {
  recordCheck(name, Boolean(value), detail || `expected truthy value, got ${String(value)}`);
}

function rowByDay(rows, day) {
  return rows.find((row) => row.dateParts?.day === day && row.dateParts?.month === 1);
}

function rowBySource(rows, sourceRowNumber) {
  return rows.find((row) => row.sourceRowNumber === sourceRowNumber);
}

function sourceNumbers(rows = []) {
  return rows.map((row) => row.sourceRowNumber).filter((value) => typeof value === "number");
}

const csvText = await readFile(fixturePath, "utf8");
const result = parseContextualSalesCsv(csvText, {
  currentDate: fixtureCurrentDate,
  futurePlaceholderZeroPolicy: "noData",
});

const rows = Array.isArray(result.rows) ? result.rows : [];
const normalized = result.normalized || {};
const dailyCandidateSources = sourceNumbers(normalized.dailyCandidates);
const excludedSources = sourceNumbers(normalized.excludedRows);
const skippedSources = sourceNumbers(normalized.skippedRows);
const csvTotalCrossCheckSummary = result.summaries?.csvTotalCrossCheckSummary || normalized.csvTotalCrossCheckSummary;

recordCheck("fixture can be read", csvText.trim().length > 0, "fixture is empty");
recordCheck(
  "parser status is ok or warning, not stop",
  [PARSER_STATUS.OK, PARSER_STATUS.WARNING].includes(result.status),
  `status was ${result.status}`
);
recordCheck("parser returned normalized rows", rows.length > 0, "no normalized rows returned");
recordCheck("month markers were detected", (normalized.monthMarkers || []).length >= 2, "expected January and future placeholder month markers");

const day1 = rowByDay(rows, 1);
const day2 = rowByDay(rows, 2);
const realZeroDay = rowByDay(rows, 3);
const dashMissingDay = rowByDay(rows, 4);
const mismatchDay = rowByDay(rows, 5);
const futurePlaceholder = rowBySource(rows, 11);

assertTruthy("month-marker day row is also parsed as a daily row", day1, "expected day 1 from source row 4");
assertTruthy("valid day row is parsed", day2, "expected day 2 from source row 5");
assertTruthy("real zero row is parsed", realZeroDay, "expected day 3 from source row 6");
assertTruthy("dash/missing row is parsed as a reviewable daily row", dashMissingDay, "expected day 4 from source row 7");
assertTruthy("CSV total mismatch row is parsed", mismatchDay, "expected day 5 from source row 8");

if (day1) {
  assertEqual("systemSales parsed on day 1", day1.systemSales?.value, 1000);
  assertEqual("outsideSystemSales parsed on day 1", day1.outsideSystemSales?.value, 200);
  assertEqual("totalSales uses formula on day 1", day1.totalSales?.value, 1200);
}

if (day2) {
  assertEqual("systemSales parsed on day 2", day2.systemSales?.value, 800);
  assertEqual("outsideSystemSales parsed on day 2", day2.outsideSystemSales?.value, 300);
  assertEqual("totalSales uses formula on day 2", day2.totalSales?.value, 1100);
}

if (realZeroDay) {
  assertEqual("real 0 remains numeric zero", realZeroDay.systemSales?.value, 0);
  assertEqual("real 0 remains active only on active row", realZeroDay.systemSales?.dataState, DATA_STATE.ACTIVE);
  assertEqual("real zero row total uses formula", realZeroDay.totalSales?.value, 150);
}

if (dashMissingDay) {
  assertEqual("dash is missing, not zero", dashMissingDay.systemSales?.value, null);
  assertEqual("dash keeps missing data state", dashMissingDay.systemSales?.dataState, DATA_STATE.MISSING);
  assertEqual("missing required value blocks total", dashMissingDay.totalSales?.value, null);
  assertEqual("missing required value keeps total missing", dashMissingDay.totalSales?.status, ROW_STATUS.MISSING_REQUIRED_FIELD);
}

if (mismatchDay) {
  assertEqual("CSV total is not official total", mismatchDay.totalSales?.value, 150);
  assertEqual("CSV total mismatch row still uses formula", mismatchDay.totalSales?.formula, "systemSales + outsideSystemSales");
}

recordCheck(
  "summary รวม row excluded from daily candidates",
  excludedSources.includes(9) && !dailyCandidateSources.includes(9) && !rowBySource(rows, 9),
  `excluded=${excludedSources.join(",")}; candidates=${dailyCandidateSources.join(",")}`
);
recordCheck(
  "blank row skipped from daily candidates",
  skippedSources.includes(10) && !dailyCandidateSources.includes(10) && !rowBySource(rows, 10),
  `skipped=${skippedSources.join(",")}; candidates=${dailyCandidateSources.join(",")}`
);

if (futurePlaceholder) {
  assertEqual("future placeholder zero row is not active sales", futurePlaceholder.dataState, DATA_STATE.NO_DATA);
  assertEqual("future placeholder systemSales is not active zero", futurePlaceholder.systemSales?.dataState, DATA_STATE.NO_DATA);
  assertEqual("future placeholder outsideSystemSales is not active zero", futurePlaceholder.outsideSystemSales?.dataState, DATA_STATE.NO_DATA);
  assertEqual("future placeholder total is not a confirmed zero sale", futurePlaceholder.totalSales?.value, null);
} else {
  recordCheck(
    "future placeholder zero row is not treated as confirmed sales",
    !dailyCandidateSources.includes(11),
    `future placeholder source row 11 is in candidates=${dailyCandidateSources.join(",")}`
  );
}

recordCheck(
  "finance/contract/profit are supporting fields only",
  Boolean(
    result.mapping?.supporting?.financeAmount?.matched
      && result.mapping?.supporting?.contractCount?.matched
      && result.mapping?.supporting?.profit?.matched
  ),
  "supporting field mapping was not fully detected"
);
recordCheck(
  "supporting fields do not affect totalSales",
  Boolean(day1 && day1.totalSales?.value === day1.systemSales?.value + day1.outsideSystemSales?.value),
  "day 1 total did not equal system + outside"
);
recordCheck(
  "CSV ยอดรวม column is mapped only as cross-check",
  Boolean(result.mapping?.crossCheck?.matched && typeof result.mapping?.columns?.csvTotalCrossCheckColumn === "number"),
  "cross-check column was not detected"
);

recordCheck(
  "CSV total cross-check summary is diagnostic only",
  Boolean(csvTotalCrossCheckSummary?.reviewOnly && csvTotalCrossCheckSummary?.validationOnly),
  "cross-check summary was missing or not review-only"
);
recordCheck(
  "CSV total cross-check summary uses official formula",
  csvTotalCrossCheckSummary?.formula === "systemSales + outsideSystemSales",
  `formula was ${csvTotalCrossCheckSummary?.formula}`
);
recordCheck(
  "CSV total cross-check has a matched row",
  (csvTotalCrossCheckSummary?.matchCount || 0) >= 1,
  `matchCount=${csvTotalCrossCheckSummary?.matchCount}`
);
recordCheck(
  "CSV total cross-check has a mismatch review row",
  (csvTotalCrossCheckSummary?.mismatchCount || 0) >= 1,
  `mismatchCount=${csvTotalCrossCheckSummary?.mismatchCount}`
);
recordCheck(
  "CSV total cross-check tracks missing CSV totals without blocking formula",
  (csvTotalCrossCheckSummary?.missingCsvTotalCount || 0) >= 1,
  `missingCsvTotalCount=${csvTotalCrossCheckSummary?.missingCsvTotalCount}`
);
recordCheck(
  "CSV total mismatch is diagnostic warning only",
  Boolean(csvTotalCrossCheckSummary?.warnings?.some((warning) => warning.code === ROW_STATUS.TOTAL_MISMATCH)),
  "mismatch warning was not present in diagnostic summary"
);
recordCheck(
  "CSV total mismatch does not change parser status",
  result.status === PARSER_STATUS.OK,
  `parser status was ${result.status}`
);

const directCrossCheck = validateContextualTotals(rows, {
  dailyCandidates: normalized.dailyCandidates,
});
recordCheck(
  "validateContextualTotals returns diagnostic summary",
  Boolean(directCrossCheck?.reviewOnly && directCrossCheck?.validationOnly && Array.isArray(directCrossCheck.rows)),
  "validateContextualTotals did not return review-only rows"
);
recordCheck(
  "validateContextualTotals detects matching CSV total",
  (directCrossCheck?.matchCount || 0) >= 1,
  `matchCount=${directCrossCheck?.matchCount}`
);
recordCheck(
  "validateContextualTotals detects mismatching CSV total",
  (directCrossCheck?.mismatchCount || 0) >= 1,
  `mismatchCount=${directCrossCheck?.mismatchCount}`
);

const mismatchCrossCheck = directCrossCheck?.rows?.find((row) => row.sourceRowNumber === mismatchDay?.sourceRowNumber);
if (mismatchCrossCheck) {
  assertEqual("CSV total mismatch row is marked totalMismatch", mismatchCrossCheck.status, ROW_STATUS.TOTAL_MISMATCH);
  assertEqual("CSV total mismatch official total remains formula value", mismatchCrossCheck.officialTotal?.value, 150);
  assertEqual("CSV total mismatch keeps CSV total separate", mismatchCrossCheck.csvTotal?.value, 999);
  assertEqual("CSV total mismatch difference is diagnostic", mismatchCrossCheck.difference, 849);
} else {
  recordCheck("CSV total mismatch diagnostic row exists", false, "source row was not found in cross-check rows");
}

const missingCsvCrossCheck = directCrossCheck?.rows?.find((row) => row.sourceRowNumber === day2?.sourceRowNumber);
if (missingCsvCrossCheck) {
  assertEqual("missing CSV total does not block official total", missingCsvCrossCheck.officialTotal?.value, 1100);
  assertEqual("missing CSV total diagnostic row is not a mismatch", missingCsvCrossCheck.status, ROW_STATUS.MISSING_REQUIRED_FIELD);
  assertEqual("missing CSV total is missing, not zero", missingCsvCrossCheck.csvTotal?.dataState, DATA_STATE.MISSING);
} else {
  recordCheck("missing CSV total diagnostic row exists", false, "source row was not found in cross-check rows");
}

const dashCrossCheck = directCrossCheck?.rows?.find((row) => row.sourceRowNumber === dashMissingDay?.sourceRowNumber);
if (dashCrossCheck) {
  assertEqual("missing required values still block official total in diagnostic", dashCrossCheck.officialTotal?.status, ROW_STATUS.MISSING_REQUIRED_FIELD);
  assertEqual("missing CSV total remains missing in diagnostic", dashCrossCheck.csvTotal?.dataState, DATA_STATE.MISSING);
} else {
  recordCheck("dash/missing diagnostic row exists", false, "source row was not found in cross-check rows");
}

const failed = checks.filter((check) => !check.passed);
const passed = checks.length - failed.length;

console.log("Contextual CSV parser readiness diagnostic");
console.log(`Fixture: ${fixturePath}`);
console.log(`Parser status: ${result.status}`);
console.log(`Rows: ${rows.length}`);
console.log(`Checks: ${passed}/${checks.length} passed`);

checks.forEach((check) => {
  const detail = !check.passed && check.detail ? ` | ${check.detail}` : "";
  console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}${detail}`);
});

if (failed.length > 0) {
  process.exitCode = 1;
}
