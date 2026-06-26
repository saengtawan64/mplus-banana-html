// Skeleton only.
// No live CSV connection approved.
// No dashboard integration approved.
// CSV "ยอดรวม" must remain validation/cross-check only.
// totalSales = systemSales + outsideSystemSales.

export const PARSER_STATUS = Object.freeze({
  OK: "ok",
  WARNING: "warning",
  STOP: "stop",
});

export const ROW_STATUS = Object.freeze({
  OK: "ok",
  NO_DATA: "noData",
  MISSING_REQUIRED_FIELD: "missingRequiredField",
  TOTAL_MISMATCH: "totalMismatch",
  INVALID_DATE: "invalidDate",
  AMBIGUOUS_HEADER: "ambiguousHeader",
  YEAR_CONFLICT: "yearConflict",
  UNSUPPORTED_STRUCTURE: "unsupportedStructure",
});

export const DATA_STATE = Object.freeze({
  ACTIVE: "active",
  MISSING: "missing",
  NO_DATA: "noData",
  INVALID: "invalid",
});

export const THAI_MONTHS = Object.freeze({
  มกราคม: 1,
  กุมภาพันธ์: 2,
  มีนาคม: 3,
  เมษายน: 4,
  พฤษภาคม: 5,
  มิถุนายน: 6,
  กรกฎาคม: 7,
  สิงหาคม: 8,
  กันยายน: 9,
  ตุลาคม: 10,
  พฤศจิกายน: 11,
  ธันวาคม: 12,
});

export const DEFAULT_TOTAL_TOLERANCE = 1;

export const CONTEXTUAL_ROWS = Object.freeze({
  SECTION_HEADER_INDEX: 1,
  FIELD_LABEL_INDEX: 2,
});

export const REQUIRED_CONTEXTUAL_FIELDS = Object.freeze({
  systemSales: Object.freeze({
    section: "ยอดในระบบ",
    field: "รวมยอด",
  }),
  outsideSystemSales: Object.freeze({
    section: "ยอดนอกระบบ",
    field: "รวมยอด",
  }),
});

export const SUPPORTING_FIELDS = Object.freeze({
  deviceCount: Object.freeze({
    section: "ยอดในระบบ",
    field: "จำนวนโทรศัพท์",
  }),
  financeAmount: Object.freeze({
    field: "ยอดจัด",
  }),
  contractCount: Object.freeze({
    field: "สญ",
  }),
  profit: Object.freeze({
    field: "กำไร",
  }),
});

export const CROSS_CHECK_FIELD = Object.freeze({
  field: "ยอดรวม",
  validationOnly: true,
});

const SKELETON_ERROR = Object.freeze({
  code: ROW_STATUS.UNSUPPORTED_STRUCTURE,
  message: "Contextual CSV parser skeleton only. Implementation not approved.",
});

const CONTEXTUAL_ROW_TYPE = Object.freeze({
  BLANK: "blank",
  MONTH_MARKER: "monthMarker",
  MONTHLY_SUMMARY: "monthlySummary",
  DAILY_CANDIDATE: "dailyCandidate",
  INVALID: "invalid",
});

function skeletonStopResult(extra = {}) {
  return {
    status: PARSER_STATUS.STOP,
    warnings: [],
    errors: [{ ...SKELETON_ERROR }],
    ...extra,
  };
}

export function parseContextualSalesCsv(rowsOrText, options = {}) {
  void rowsOrText;
  void options;

  return skeletonStopResult({
    rows: [],
    mapping: null,
  });
}

export function detectContextualMapping(rows, options = {}) {
  void rows;
  void options;

  return skeletonStopResult({
    complete: false,
    columns: null,
  });
}

export function normalizeContextualRows(rows, mapping, options = {}) {
  void rows;
  void mapping;
  void options;

  return skeletonStopResult({
    rows: [],
    excludedRows: [],
    skippedRows: [],
  });
}

export function validateContextualTotals(rows, options = {}) {
  void rows;
  void options;

  return skeletonStopResult({
    rows: [],
  });
}

function parseContextualNumber(value, context = {}) {
  void context;

  const missingResult = {
    status: ROW_STATUS.MISSING_REQUIRED_FIELD,
    value: null,
    warnings: [],
    errors: [],
  };

  if (value === null || value === undefined) return missingResult;

  const cleaned = String(value)
    .trim()
    .replace(/,/g, "")
    .replace(/฿/g, "")
    .replace(/บาท/g, "")
    .trim();

  if (cleaned === "" || cleaned === "-") return missingResult;

  const number = Number(cleaned);
  if (Number.isNaN(number)) return missingResult;

  return {
    status: ROW_STATUS.OK,
    value: number,
    warnings: [],
    errors: [],
  };
}

function parseThaiMonthMarker(value) {
  const label = String(value || "").trim().replace(/\s+/g, " ");
  const invalidResult = {
    status: ROW_STATUS.INVALID_DATE,
    month: null,
    buddhistYear: null,
    gregorianYear: null,
    label,
    warnings: [],
    errors: [
      {
        code: ROW_STATUS.INVALID_DATE,
        message: "Invalid Thai month marker.",
      },
    ],
  };

  if (!label) return invalidResult;

  const match = label.match(/^เดือน\s+(.+?)\s+(\d{4})$/);
  if (!match) return invalidResult;

  const month = THAI_MONTHS[match[1]];
  const buddhistYear = Number(match[2]);
  if (!month || Number.isNaN(buddhistYear)) return invalidResult;

  return {
    status: ROW_STATUS.OK,
    month,
    buddhistYear,
    gregorianYear: buddhistYear - 543,
    label,
    warnings: [],
    errors: [],
  };
}

function parseContextualDay(value) {
  const invalidResult = {
    status: ROW_STATUS.INVALID_DATE,
    day: null,
    warnings: [],
    errors: [
      {
        code: ROW_STATUS.INVALID_DATE,
        message: "Invalid contextual day.",
      },
    ],
  };

  if (value === null || value === undefined) return invalidResult;

  const cleaned = String(value).trim();
  if (!/^\d+$/.test(cleaned)) return invalidResult;

  const day = Number(cleaned);
  if (!Number.isInteger(day) || day < 1 || day > 31) return invalidResult;

  return {
    status: ROW_STATUS.OK,
    day,
    warnings: [],
    errors: [],
  };
}

function isBlankContextualRow(row) {
  if (!Array.isArray(row) || row.length === 0) return true;
  return row.every((cell) => cell === null || cell === undefined || String(cell).trim() === "");
}

function isMonthMarkerRow(row, mapping = {}) {
  if (!Array.isArray(row)) return false;
  const monthMarkerColumn = typeof mapping.monthMarkerColumn === "number" ? mapping.monthMarkerColumn : 0;
  if (monthMarkerColumn < 0 || monthMarkerColumn >= row.length) return false;
  return parseThaiMonthMarker(row[monthMarkerColumn]).status === ROW_STATUS.OK;
}

function isMonthlySummaryRow(row, mapping = {}) {
  if (!Array.isArray(row)) return false;
  const dayColumn = typeof mapping.dayColumn === "number" ? mapping.dayColumn : 1;
  if (dayColumn < 0 || dayColumn >= row.length) return false;
  return String(row[dayColumn] ?? "").trim() === "รวม";
}

function classifyContextualRow(row, context = {}, mapping = {}) {
  const sourceRowNumber = context.sourceRowNumber ?? null;
  const baseResult = {
    day: null,
    monthMarker: null,
    sourceRowNumber,
    warnings: [],
    errors: [],
  };

  if (!Array.isArray(row)) {
    return {
      ...baseResult,
      status: ROW_STATUS.UNSUPPORTED_STRUCTURE,
      dataState: DATA_STATE.INVALID,
      rowType: CONTEXTUAL_ROW_TYPE.INVALID,
      errors: [
        {
          code: ROW_STATUS.UNSUPPORTED_STRUCTURE,
          message: "Contextual row must be an array.",
        },
      ],
    };
  }

  if (isBlankContextualRow(row)) {
    return {
      ...baseResult,
      status: ROW_STATUS.OK,
      dataState: DATA_STATE.NO_DATA,
      rowType: CONTEXTUAL_ROW_TYPE.BLANK,
    };
  }

  if (isMonthMarkerRow(row, mapping)) {
    const monthMarkerColumn = typeof mapping.monthMarkerColumn === "number" ? mapping.monthMarkerColumn : 0;
    return {
      ...baseResult,
      status: ROW_STATUS.OK,
      dataState: DATA_STATE.ACTIVE,
      rowType: CONTEXTUAL_ROW_TYPE.MONTH_MARKER,
      monthMarker: parseThaiMonthMarker(row[monthMarkerColumn]),
    };
  }

  const monthMarkerColumn = typeof mapping.monthMarkerColumn === "number" ? mapping.monthMarkerColumn : 0;
  const monthMarkerCell = row[monthMarkerColumn];
  if (String(monthMarkerCell ?? "").trim().startsWith("เดือน")) {
    const monthMarker = parseThaiMonthMarker(monthMarkerCell);
    return {
      ...baseResult,
      status: ROW_STATUS.INVALID_DATE,
      dataState: DATA_STATE.INVALID,
      rowType: CONTEXTUAL_ROW_TYPE.INVALID,
      monthMarker,
      errors: monthMarker.errors,
    };
  }

  if (isMonthlySummaryRow(row, mapping)) {
    return {
      ...baseResult,
      status: ROW_STATUS.OK,
      dataState: DATA_STATE.NO_DATA,
      rowType: CONTEXTUAL_ROW_TYPE.MONTHLY_SUMMARY,
    };
  }

  const dayColumn = typeof mapping.dayColumn === "number" ? mapping.dayColumn : 1;
  const dayResult = parseContextualDay(row[dayColumn]);
  if (dayResult.status === ROW_STATUS.OK) {
    return {
      ...baseResult,
      status: ROW_STATUS.OK,
      dataState: DATA_STATE.ACTIVE,
      rowType: CONTEXTUAL_ROW_TYPE.DAILY_CANDIDATE,
      day: dayResult.day,
    };
  }

  return {
    ...baseResult,
    status: ROW_STATUS.INVALID_DATE,
    dataState: DATA_STATE.INVALID,
    rowType: CONTEXTUAL_ROW_TYPE.INVALID,
    errors: dayResult.errors,
  };
}
