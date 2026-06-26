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
  void options;

  const result = {
    status: PARSER_STATUS.OK,
    complete: false,
    columns: {
      monthMarkerColumn: 0,
      dayColumn: null,
      systemSalesColumn: null,
      outsideSystemSalesColumn: null,
      deviceCountColumn: null,
      financeAmountColumn: null,
      contractCountColumn: null,
      profitColumn: null,
      csvTotalCrossCheckColumn: null,
    },
    required: {
      day: {
        field: "วันที่",
        column: null,
        matched: false,
        confidence: "low",
      },
      systemSales: {
        ...REQUIRED_CONTEXTUAL_FIELDS.systemSales,
        column: null,
        matched: false,
        confidence: "low",
      },
      outsideSystemSales: {
        ...REQUIRED_CONTEXTUAL_FIELDS.outsideSystemSales,
        column: null,
        matched: false,
        confidence: "low",
      },
    },
    supporting: {
      deviceCount: {
        ...SUPPORTING_FIELDS.deviceCount,
        column: null,
        matched: false,
        confidence: "low",
      },
      financeAmount: {
        ...SUPPORTING_FIELDS.financeAmount,
        column: null,
        matched: false,
        confidence: "low",
      },
      contractCount: {
        ...SUPPORTING_FIELDS.contractCount,
        column: null,
        matched: false,
        confidence: "low",
      },
      profit: {
        ...SUPPORTING_FIELDS.profit,
        column: null,
        matched: false,
        confidence: "low",
      },
    },
    crossCheck: {
      ...CROSS_CHECK_FIELD,
      column: null,
      matched: false,
      confidence: "low",
    },
    warnings: [
      {
        code: "defaultMonthMarkerColumn",
        message: "Month marker column defaults to index 0 until contextual mapping is fully implemented.",
      },
    ],
    errors: [],
  };

  if (!Array.isArray(rows)) {
    return {
      ...result,
      status: PARSER_STATUS.STOP,
      errors: [
        {
          code: ROW_STATUS.UNSUPPORTED_STRUCTURE,
          message: "Contextual rows must be an array.",
        },
      ],
    };
  }

  const sectionRow = rows[CONTEXTUAL_ROWS.SECTION_HEADER_INDEX];
  const fieldRow = rows[CONTEXTUAL_ROWS.FIELD_LABEL_INDEX];

  if (!Array.isArray(sectionRow)) {
    return {
      ...result,
      status: PARSER_STATUS.STOP,
      errors: [
        {
          code: ROW_STATUS.UNSUPPORTED_STRUCTURE,
          message: "Contextual section header row is missing.",
        },
      ],
    };
  }

  if (!Array.isArray(fieldRow)) {
    return {
      ...result,
      status: PARSER_STATUS.STOP,
      errors: [
        {
          code: ROW_STATUS.UNSUPPORTED_STRUCTURE,
          message: "Contextual field label row is missing.",
        },
      ],
    };
  }

  const sectionContexts = buildSectionContext(sectionRow, fieldRow.length);

  const dayMatch = findFieldColumn(fieldRow, result.required.day.field);
  applyRequiredFieldMatch(result, "day", dayMatch);

  const systemSalesMatch = findSectionFieldColumn(
    sectionContexts,
    fieldRow,
    REQUIRED_CONTEXTUAL_FIELDS.systemSales.section,
    REQUIRED_CONTEXTUAL_FIELDS.systemSales.field
  );
  applyRequiredFieldMatch(result, "systemSales", systemSalesMatch);

  const outsideSystemSalesMatch = findSectionFieldColumn(
    sectionContexts,
    fieldRow,
    REQUIRED_CONTEXTUAL_FIELDS.outsideSystemSales.section,
    REQUIRED_CONTEXTUAL_FIELDS.outsideSystemSales.field
  );
  applyRequiredFieldMatch(result, "outsideSystemSales", outsideSystemSalesMatch);

  applySupportingFieldMatch(
    result,
    "deviceCount",
    findSectionFieldColumn(
      sectionContexts,
      fieldRow,
      SUPPORTING_FIELDS.deviceCount.section,
      SUPPORTING_FIELDS.deviceCount.field
    )
  );
  applySupportingFieldMatch(result, "financeAmount", findFieldColumn(fieldRow, SUPPORTING_FIELDS.financeAmount.field));
  applySupportingFieldMatch(result, "contractCount", findFieldColumn(fieldRow, SUPPORTING_FIELDS.contractCount.field));
  applySupportingFieldMatch(result, "profit", findFieldColumn(fieldRow, SUPPORTING_FIELDS.profit.field));

  const crossCheckMatch = findFieldColumn(fieldRow, CROSS_CHECK_FIELD.field);
  if (crossCheckMatch.status === ROW_STATUS.OK) {
    const conflictsWithRequiredSalesColumn = [
      result.columns.systemSalesColumn,
      result.columns.outsideSystemSalesColumn,
    ].includes(crossCheckMatch.column);

    if (conflictsWithRequiredSalesColumn) {
      result.warnings.push({
        code: ROW_STATUS.AMBIGUOUS_HEADER,
        message: `Cross-check field "${CROSS_CHECK_FIELD.field}" conflicts with a required sales column and was ignored.`,
      });
    } else {
      result.columns.csvTotalCrossCheckColumn = crossCheckMatch.column;
      result.crossCheck = {
        ...result.crossCheck,
        column: crossCheckMatch.column,
        matched: true,
        confidence: "high",
      };
    }
  } else if (crossCheckMatch.status === ROW_STATUS.AMBIGUOUS_HEADER) {
    result.warnings.push({
      code: ROW_STATUS.AMBIGUOUS_HEADER,
      message: `Optional cross-check field "${CROSS_CHECK_FIELD.field}" matched multiple columns.`,
    });
  }

  const missingRequired = Object.entries(result.required).filter(([, field]) => !field.matched && !field.ambiguous);
  missingRequired.forEach(([key, field]) => {
    result.errors.push({
      code: ROW_STATUS.MISSING_REQUIRED_FIELD,
      message: `Required contextual mapping "${key}" was not detected for field "${field.field}".`,
    });
  });

  if (result.errors.length > 0) {
    result.status = PARSER_STATUS.STOP;
    result.complete = false;
  } else {
    result.complete = true;
    result.status = result.warnings.length > 0 ? PARSER_STATUS.WARNING : PARSER_STATUS.OK;
  }

  return result;
}

export function normalizeContextualRows(rows, mapping, options = {}) {
  void options;

  const result = {
    status: PARSER_STATUS.OK,
    rows: [],
    classifiedRows: [],
    dailyCandidates: [],
    excludedRows: [],
    skippedRows: [],
    invalidRows: [],
    monthMarkers: [],
    salesPreviewSummary: createSalesPreviewReviewSummary([]),
    draftRowsSummary: createNormalizedDraftRowsReviewSummary([]),
    warnings: [],
    errors: [],
  };

  if (!Array.isArray(rows)) {
    return {
      ...result,
      status: PARSER_STATUS.STOP,
      errors: [
        {
          code: ROW_STATUS.UNSUPPORTED_STRUCTURE,
          message: "Contextual rows must be an array.",
        },
      ],
    };
  }

  let currentMonthContext = null;
  const classificationMapping = createClassificationMapping(mapping);

  rows.forEach((row, index) => {
    const classification = classifyContextualRow(row, { sourceRowNumber: index + 1 }, classificationMapping);
    const classifiedRow = {
      ...classification,
      monthContext: currentMonthContext,
    };

    if (classification.rowType === CONTEXTUAL_ROW_TYPE.MONTH_MARKER) {
      currentMonthContext = classification.monthMarker;
      classifiedRow.monthContext = currentMonthContext;
      result.monthMarkers.push(classifiedRow);
    } else if (classification.rowType === CONTEXTUAL_ROW_TYPE.DAILY_CANDIDATE) {
      result.dailyCandidates.push(createDailyCandidateMetadata(classifiedRow, row, mapping));
    } else if (classification.rowType === CONTEXTUAL_ROW_TYPE.MONTHLY_SUMMARY) {
      result.excludedRows.push(classifiedRow);
    } else if (classification.rowType === CONTEXTUAL_ROW_TYPE.BLANK) {
      result.skippedRows.push(classifiedRow);
    } else if (classification.rowType === CONTEXTUAL_ROW_TYPE.INVALID) {
      result.invalidRows.push(classifiedRow);
    }

    result.classifiedRows.push(classifiedRow);
  });

  if (result.invalidRows.length > 0) {
    result.status = PARSER_STATUS.WARNING;
    result.warnings.push({
      code: ROW_STATUS.UNSUPPORTED_STRUCTURE,
      message: "Some contextual rows could not be classified.",
    });
  }

  result.salesPreviewSummary = createSalesPreviewReviewSummary(result.dailyCandidates);
  result.rows = createNormalizedDailySalesRows(result.dailyCandidates);
  result.draftRowsSummary = createNormalizedDraftRowsReviewSummary(result.rows);

  return result;
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

function createDailyCandidateMetadata(classifiedRow, rawRow, mapping = {}) {
  const candidate = {
    sourceRowNumber: classifiedRow.sourceRowNumber,
    rowType: classifiedRow.rowType,
    status: classifiedRow.status,
    dataState: classifiedRow.dataState,
    day: classifiedRow.day,
    monthContext: classifiedRow.monthContext,
    mappingSnapshot: createMappingSnapshot(mapping),
    rawRow: Array.isArray(rawRow) ? rawRow.slice() : [],
    warnings: classifiedRow.warnings.slice(),
    errors: classifiedRow.errors.slice(),
  };

  return {
    ...candidate,
    salesPreview: createDailyCandidateSalesPreview(candidate),
  };
}

function createDailyCandidateSalesPreview(candidate) {
  return {
    systemSales: readPreviewNumber(candidate.rawRow, candidate.mappingSnapshot.systemSalesColumn),
    outsideSystemSales: readPreviewNumber(candidate.rawRow, candidate.mappingSnapshot.outsideSystemSalesColumn),
    reviewOnly: true,
  };
}

function readPreviewNumber(rawRow, column) {
  if (!Array.isArray(rawRow) || typeof column !== "number") {
    return {
      column: null,
      status: ROW_STATUS.MISSING_REQUIRED_FIELD,
      value: null,
      dataState: DATA_STATE.MISSING,
      warnings: [],
      errors: [],
    };
  }

  const parsed = parseContextualNumber(rawRow[column]);
  return {
    column,
    status: parsed.status,
    value: parsed.value,
    dataState: parsed.status === ROW_STATUS.OK ? DATA_STATE.ACTIVE : DATA_STATE.MISSING,
    warnings: parsed.warnings.slice(),
    errors: parsed.errors.slice(),
  };
}

function createSalesPreviewReviewSummary(dailyCandidates) {
  const summary = {
    reviewOnly: true,
    dailyCandidateCount: dailyCandidates.length,
    previewReadableCount: 0,
    systemSalesReadableCount: 0,
    outsideSystemSalesReadableCount: 0,
    systemSalesMissingCount: 0,
    outsideSystemSalesMissingCount: 0,
    rowsWithoutMonthContextCount: 0,
    warnings: [],
    errors: [],
  };

  dailyCandidates.forEach((candidate) => {
    const systemSalesReadable = isReadablePreviewValue(candidate.salesPreview?.systemSales);
    const outsideSystemSalesReadable = isReadablePreviewValue(candidate.salesPreview?.outsideSystemSales);

    if (systemSalesReadable) summary.systemSalesReadableCount += 1;
    else summary.systemSalesMissingCount += 1;

    if (outsideSystemSalesReadable) summary.outsideSystemSalesReadableCount += 1;
    else summary.outsideSystemSalesMissingCount += 1;

    if (systemSalesReadable && outsideSystemSalesReadable) summary.previewReadableCount += 1;
    if (!candidate.monthContext) summary.rowsWithoutMonthContextCount += 1;
  });

  return summary;
}

function isReadablePreviewValue(previewField) {
  return previewField?.status === ROW_STATUS.OK;
}

function createNormalizedDailySalesRows(dailyCandidates) {
  return dailyCandidates.map((candidate) => createNormalizedDailySalesDraft(candidate));
}

function createNormalizedDailySalesDraft(candidate) {
  const systemSales = createDraftSalesValue(candidate.salesPreview?.systemSales);
  const outsideSystemSales = createDraftSalesValue(candidate.salesPreview?.outsideSystemSales);
  const hasValidDay = typeof candidate.day === "number";
  const hasMonthContext = Boolean(candidate.monthContext);
  const warnings = [];
  const errors = [];

  if (!hasValidDay) {
    errors.push({
      code: ROW_STATUS.INVALID_DATE,
      message: "Daily sales draft is missing a valid day.",
    });
  }

  if (!hasMonthContext) {
    errors.push({
      code: ROW_STATUS.INVALID_DATE,
      message: "Daily sales draft is missing month context.",
    });
  }

  const dataState = !hasValidDay || !hasMonthContext
    ? DATA_STATE.INVALID
    : systemSales.dataState === DATA_STATE.ACTIVE && outsideSystemSales.dataState === DATA_STATE.ACTIVE
      ? DATA_STATE.ACTIVE
      : DATA_STATE.MISSING;

  return {
    reviewOnly: true,
    sourceRowNumber: candidate.sourceRowNumber,
    dateParts: hasValidDay && hasMonthContext
      ? {
        day: candidate.day,
        month: candidate.monthContext.month,
        buddhistYear: candidate.monthContext.buddhistYear,
        gregorianYear: candidate.monthContext.gregorianYear,
        sourceMonthLabel: candidate.monthContext.label,
      }
      : null,
    date: null,
    dataState,
    systemSales,
    outsideSystemSales,
    warnings,
    errors,
  };
}

function createDraftSalesValue(previewField) {
  return {
    value: previewField?.value ?? null,
    dataState: previewField?.status === ROW_STATUS.OK ? DATA_STATE.ACTIVE : DATA_STATE.MISSING,
    sourceColumn: typeof previewField?.column === "number" ? previewField.column : null,
    status: previewField?.status || ROW_STATUS.MISSING_REQUIRED_FIELD,
  };
}

function createNormalizedDraftRowsReviewSummary(rows) {
  const summary = {
    reviewOnly: true,
    draftRowCount: rows.length,
    activeDraftRowCount: 0,
    missingDraftRowCount: 0,
    invalidDraftRowCount: 0,
    rowsWithoutDatePartsCount: 0,
    systemSalesMissingCount: 0,
    outsideSystemSalesMissingCount: 0,
    warnings: [],
    errors: [],
  };

  rows.forEach((row) => {
    if (row.dataState === DATA_STATE.ACTIVE) summary.activeDraftRowCount += 1;
    if (row.dataState === DATA_STATE.MISSING) summary.missingDraftRowCount += 1;
    if (row.dataState === DATA_STATE.INVALID) summary.invalidDraftRowCount += 1;
    if (!row.dateParts) summary.rowsWithoutDatePartsCount += 1;
    if (row.systemSales?.dataState !== DATA_STATE.ACTIVE) summary.systemSalesMissingCount += 1;
    if (row.outsideSystemSales?.dataState !== DATA_STATE.ACTIVE) summary.outsideSystemSalesMissingCount += 1;
  });

  return summary;
}

function createClassificationMapping(mapping = {}) {
  return {
    ...mapping,
    ...(mapping.columns || {}),
  };
}

function createMappingSnapshot(mapping = {}) {
  const columns = mapping.columns || mapping;
  return {
    dayColumn: readMappingColumn(columns, "dayColumn"),
    monthMarkerColumn: readMappingColumn(columns, "monthMarkerColumn"),
    systemSalesColumn: readMappingColumn(columns, "systemSalesColumn"),
    outsideSystemSalesColumn: readMappingColumn(columns, "outsideSystemSalesColumn"),
    deviceCountColumn: readMappingColumn(columns, "deviceCountColumn"),
    financeAmountColumn: readMappingColumn(columns, "financeAmountColumn"),
    contractCountColumn: readMappingColumn(columns, "contractCountColumn"),
    profitColumn: readMappingColumn(columns, "profitColumn"),
    csvTotalCrossCheckColumn: readMappingColumn(columns, "csvTotalCrossCheckColumn"),
  };
}

function readMappingColumn(columns, key) {
  return typeof columns?.[key] === "number" ? columns[key] : null;
}

function normalizeContextualLabel(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function buildSectionContext(sectionRow, length = sectionRow.length) {
  const contexts = [];
  let currentSection = "";

  for (let index = 0; index < length; index += 1) {
    const sectionLabel = normalizeContextualLabel(sectionRow[index]);
    if (sectionLabel) currentSection = sectionLabel;
    contexts[index] = currentSection;
  }

  return contexts;
}

function findFieldColumn(fieldRow, fieldLabel) {
  const target = normalizeContextualLabel(fieldLabel);
  const matches = fieldRow.reduce((columns, value, index) => {
    if (normalizeContextualLabel(value) === target) columns.push(index);
    return columns;
  }, []);

  if (matches.length === 1) {
    return {
      status: ROW_STATUS.OK,
      column: matches[0],
      matches,
    };
  }

  if (matches.length > 1) {
    return {
      status: ROW_STATUS.AMBIGUOUS_HEADER,
      column: null,
      matches,
    };
  }

  return {
    status: ROW_STATUS.MISSING_REQUIRED_FIELD,
    column: null,
    matches,
  };
}

function findSectionFieldColumn(sectionContexts, fieldRow, sectionLabel, fieldLabel) {
  const targetSection = normalizeContextualLabel(sectionLabel);
  const targetField = normalizeContextualLabel(fieldLabel);
  const matches = fieldRow.reduce((columns, value, index) => {
    const sectionMatches = normalizeContextualLabel(sectionContexts[index]) === targetSection;
    const fieldMatches = normalizeContextualLabel(value) === targetField;
    if (sectionMatches && fieldMatches) columns.push(index);
    return columns;
  }, []);

  if (matches.length === 1) {
    return {
      status: ROW_STATUS.OK,
      column: matches[0],
      matches,
    };
  }

  if (matches.length > 1) {
    return {
      status: ROW_STATUS.AMBIGUOUS_HEADER,
      column: null,
      matches,
    };
  }

  return {
    status: ROW_STATUS.MISSING_REQUIRED_FIELD,
    column: null,
    matches,
  };
}

function applyRequiredFieldMatch(result, fieldKey, match) {
  if (match.status === ROW_STATUS.OK) {
    result.required[fieldKey] = {
      ...result.required[fieldKey],
      column: match.column,
      matched: true,
      confidence: "high",
    };
    result.columns[`${fieldKey}Column`] = match.column;
    return;
  }

  if (match.status === ROW_STATUS.AMBIGUOUS_HEADER) {
    result.required[fieldKey] = {
      ...result.required[fieldKey],
      ambiguous: true,
    };
    result.errors.push({
      code: ROW_STATUS.AMBIGUOUS_HEADER,
      message: `Required contextual mapping "${fieldKey}" matched multiple columns.`,
    });
  }
}

function applySupportingFieldMatch(result, fieldKey, match) {
  if (match.status === ROW_STATUS.OK) {
    result.supporting[fieldKey] = {
      ...result.supporting[fieldKey],
      column: match.column,
      matched: true,
      confidence: "high",
    };
    result.columns[`${fieldKey}Column`] = match.column;
    return;
  }

  if (match.status === ROW_STATUS.AMBIGUOUS_HEADER) {
    result.warnings.push({
      code: ROW_STATUS.AMBIGUOUS_HEADER,
      message: `Optional contextual mapping "${fieldKey}" matched multiple columns.`,
    });
  }
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
