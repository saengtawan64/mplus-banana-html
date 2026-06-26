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
  void value;

  return {
    status: ROW_STATUS.UNSUPPORTED_STRUCTURE,
    month: null,
    buddhistYear: null,
    gregorianYear: null,
    label: "",
    warnings: [],
    errors: [{ ...SKELETON_ERROR }],
  };
}

function classifyContextualRow(row, context = {}, mapping = {}) {
  void row;
  void context;
  void mapping;

  return {
    status: ROW_STATUS.UNSUPPORTED_STRUCTURE,
    dataState: DATA_STATE.INVALID,
    rowType: "unsupported",
    warnings: [],
    errors: [{ ...SKELETON_ERROR }],
  };
}
