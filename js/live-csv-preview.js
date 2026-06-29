import { parseContextualSalesCsv } from "./contextual-csv-mapping.js";

const LIVE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vScmRS5VCtLON--xd_4FnRvUAV8pASPi8bPOq57jYStFzh0C97JtaisyOLjoGyIecYXhyIDceK4-7Jh/pub?gid=614260076&single=true&output=csv";

const statusMeta = {
  loading: {
    title: "สถานะ CSV: กำลังตรวจ",
    description: "กำลังตรวจ CSV แบบ read-only...",
    tone: "neutral",
  },
  success: {
    title: "สถานะ CSV: ใช้งานได้",
    description: "ตารางรายวัน: ใช้ข้อมูล CSV ตรวจสอบแล้ว",
    tone: "success",
  },
  stop: {
    title: "สถานะ CSV: ต้องตรวจสอบ",
    description: "อ่าน CSV ได้ แต่โครงสร้างยังไม่พร้อมใช้งาน",
    tone: "warning",
  },
  failed: {
    title: "สถานะ CSV: โหลดไม่สำเร็จ",
    description: "ตารางรายวัน: แสดงข้อมูลตัวอย่างแทน",
    tone: "failed",
  },
};

const boundaryNotes = [
  "CSV ใช้เฉพาะตารางรายวันเมื่อ Parser: ok",
  "CSV ยอดรวมใช้ตรวจสอบเท่านั้น ไม่ใช่ยอดรวมทางการ",
  "ยอดรวมทางการ = ยอดในระบบ + ยอดนอกระบบ",
  "การ์ด/กราฟยังเป็นข้อมูลตัวอย่าง",
];
const dailyTableFallbackText = "ตารางรายวัน: แสดงข้อมูลตัวอย่างแทน";
const dailyTableCsvReadyText = "ตารางรายวัน: ใช้ข้อมูล CSV ตรวจสอบแล้ว";
const dailyTableCsvWarningText = "ตารางรายวัน: แสดงข้อมูลตัวอย่างแทน / CSV Preview มีบางแถวต้องตรวจสอบ";

let originalDailyTableHtml = null;
let dailyTableWasReplaced = false;

function getPreviewElements() {
  return {
    panel: document.querySelector("#liveCsvPreviewPanel"),
    status: document.querySelector("#liveCsvPreviewStatus"),
    table: document.querySelector("#liveCsvPreviewTable"),
    rows: document.querySelector("#liveCsvPreviewRows"),
  };
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function getDailyTableRowCount() {
  const { rows } = getDailyTableElements();
  return rows ? rows.querySelectorAll("tr").length : 0;
}

function renderDiagnosticChip(parent, label, value, modifier = "") {
  const chip = appendTextElement(parent, "span", `dashboard-csv-chip${modifier ? ` ${modifier}` : ""}`, "");
  appendTextElement(chip, "span", "dashboard-csv-chip-label", label);
  appendTextElement(chip, "strong", "dashboard-csv-chip-value", String(value));
}

function renderPreviewStatus(state, details = {}) {
  const { status } = getPreviewElements();
  if (!status) return;

  const meta = statusMeta[state] || statusMeta.failed;
  const dailyRowCount = getDailyTableRowCount();
  const parserStatus = details.parserStatus || (state === "failed" ? "ไม่ได้ตรวจ" : "-");
  const draftRows = typeof details.draftRowCount === "number" ? details.draftRowCount : "-";
  const warnings = typeof details.warningCount === "number" ? details.warningCount : "-";
  const errors = typeof details.errorCount === "number" ? details.errorCount : "-";

  status.classList.remove("is-neutral", "is-success", "is-warning", "is-failed");
  status.classList.add(`is-${meta.tone}`);
  status.textContent = "";

  const wrapper = appendTextElement(status, "div", "dashboard-csv-diagnostics", "");
  const header = appendTextElement(wrapper, "div", "dashboard-csv-diagnostics-header", "");
  appendTextElement(header, "strong", "dashboard-csv-state", meta.title);
  appendTextElement(header, "span", "dashboard-csv-state-copy", meta.description);

  const grid = appendTextElement(wrapper, "div", "dashboard-csv-chip-grid", "");
  renderDiagnosticChip(grid, "Fetch", details.fetchStatus || "checking", details.fetchStatus === "success" ? "is-good" : "");
  renderDiagnosticChip(grid, "Parser", parserStatus, parserStatus === "ok" ? "is-good" : "");
  renderDiagnosticChip(grid, "จำนวนแถว CSV", draftRows);
  renderDiagnosticChip(grid, "ตารางรายวัน", `${dailyRowCount} แถว`);
  renderDiagnosticChip(grid, "Warnings", warnings, warnings === 0 ? "is-good" : "");
  renderDiagnosticChip(grid, "Errors", errors, errors === 0 ? "is-good" : "");
  if (details.checkedAt) renderDiagnosticChip(grid, "ตรวจล่าสุด", details.checkedAt);

  const boundary = appendTextElement(wrapper, "div", "dashboard-csv-boundary", "");
  boundaryNotes.forEach((note) => {
    appendTextElement(boundary, "span", "dashboard-csv-boundary-item", note);
  });
}

function clearPreviewTable() {
  const { table, rows } = getPreviewElements();
  if (rows) rows.textContent = "";
  if (table) table.hidden = true;
}

function formatPreviewDate(dateParts) {
  if (!dateParts) return "ไม่มีข้อมูล";
  return `${dateParts.day}/${dateParts.month}/${dateParts.buddhistYear}`;
}

function formatPreviewValue(field) {
  if (!field || field.value === null || field.value === undefined) return "-";
  return String(field.value);
}

function getPreviewNote(row, result) {
  const notes = [];

  if (!row.dateParts) notes.push("ไม่มีบริบทเดือน");
  if (row.systemSales?.dataState !== "active") notes.push("ไม่มีข้อมูลยอดในระบบ");
  if (row.outsideSystemSales?.dataState !== "active") notes.push("ไม่มีข้อมูลยอดนอกระบบ");
  if (row.dataState === "invalid") notes.push("แถวนี้ยังไม่พร้อมใช้งาน");
  if (result.status === "warning") notes.push("บางแถวมีข้อมูลไม่ครบ");

  return notes.length > 0 ? notes.join(" / ") : "-";
}

function renderPreviewTable(result) {
  const { table, rows } = getPreviewElements();
  if (!table || !rows) return;

  rows.textContent = "";

  if (!Array.isArray(result.rows) || result.rows.length === 0 || result.status === "stop") {
    table.hidden = true;
    return;
  }

  result.rows.forEach((row) => {
    const tr = document.createElement("tr");
    const cells = [
      formatPreviewDate(row.dateParts),
      formatPreviewValue(row.systemSales),
      formatPreviewValue(row.outsideSystemSales),
      formatPreviewValue(row.totalSales),
      row.dataState || "ตรวจไม่ได้",
      getPreviewNote(row, result),
    ];

    cells.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    rows.appendChild(tr);
  });

  table.hidden = false;
}

function getDailyTableElements() {
  return {
    note: document.querySelector("#dailyTableDataSourceNote"),
    rows: document.querySelector("#dailySalesRows"),
  };
}

function setDailyTableNote(message, options = {}) {
  const { note } = getDailyTableElements();
  if (!note) return;

  const rowCount = typeof options.rowCount === "number" ? options.rowCount : getDailyTableRowCount();
  const rowLabel = options.rowLabel || "จำนวนแถว";
  note.textContent = `${message} | ${rowLabel}: ${rowCount}`;
}

function captureOriginalDailyTableHtml() {
  const { rows } = getDailyTableElements();
  if (!rows || originalDailyTableHtml !== null) return;
  if (rows.innerHTML.trim()) originalDailyTableHtml = rows.innerHTML;
}

function restoreSampleDailyTable(noteText = dailyTableFallbackText) {
  const { rows } = getDailyTableElements();
  if (rows && dailyTableWasReplaced && originalDailyTableHtml !== null) {
    rows.innerHTML = originalDailyTableHtml;
  }
  dailyTableWasReplaced = false;
  setDailyTableNote(noteText, { rowLabel: "จำนวนแถวตัวอย่าง" });
}

function getDailyTableStatusLabel(row) {
  if (!row.dateParts || row.dataState === "invalid") return "ตรวจไม่ได้";
  if (row.systemSales?.dataState !== "active" || row.outsideSystemSales?.dataState !== "active") {
    return "ไม่มีข้อมูล";
  }
  return "-";
}

function appendDailyTableCell(tr, value, className = "") {
  const td = document.createElement("td");
  td.textContent = value;
  if (className) td.className = className;
  tr.appendChild(td);
}

function renderCsvBackedDailyTable(result) {
  const { rows } = getDailyTableElements();
  if (!rows || !Array.isArray(result.rows) || result.rows.length === 0) return false;

  captureOriginalDailyTableHtml();
  if (originalDailyTableHtml === null) return false;

  rows.textContent = "";

  result.rows.forEach((row) => {
    const tr = document.createElement("tr");
    appendDailyTableCell(tr, formatPreviewDate(row.dateParts));
    appendDailyTableCell(tr, formatPreviewValue(row.totalSales), "amount-cell");
    appendDailyTableCell(tr, formatPreviewValue(row.systemSales), "amount-cell");
    appendDailyTableCell(tr, formatPreviewValue(row.outsideSystemSales), "amount-cell");
    appendDailyTableCell(tr, getDailyTableStatusLabel(row));
    rows.appendChild(tr);
  });

  dailyTableWasReplaced = true;
  setDailyTableNote(dailyTableCsvReadyText, {
    rowCount: result.rows.length,
    rowLabel: "จำนวนแถว CSV",
  });
  return true;
}

function syncCsvBackedDailyTable(result) {
  if (result?.status === "ok" && renderCsvBackedDailyTable(result)) return;

  if (result?.status === "warning") {
    restoreSampleDailyTable(dailyTableCsvWarningText);
    return;
  }

  restoreSampleDailyTable();
}

function getCacheBustedUrl(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}previewTs=${Date.now()}`;
}

function getParserPreviewDetails(result) {
  return {
    parserStatus: result.status,
    draftRowCount: Array.isArray(result.rows) ? result.rows.length : 0,
    warningCount: result.warnings?.length || 0,
    errorCount: result.errors?.length || 0,
    checkedAt: new Date().toLocaleString("th-TH"),
  };
}

async function loadLiveCsvPreview() {
  const { panel } = getPreviewElements();
  if (!panel) return;

  renderPreviewStatus("loading");
  clearPreviewTable();
  captureOriginalDailyTableHtml();
  restoreSampleDailyTable();

  try {
    const response = await fetch(getCacheBustedUrl(LIVE_CSV_URL), { cache: "no-store" });
    if (!response.ok) {
      restoreSampleDailyTable();
      renderPreviewStatus("failed", {
        fetchStatus: `HTTP ${response.status}`,
        checkedAt: new Date().toLocaleString("th-TH"),
      });
      return;
    }

    const csvText = await response.text();
    if (!csvText.trim()) {
      restoreSampleDailyTable();
      renderPreviewStatus("failed", {
        fetchStatus: "empty response",
        checkedAt: new Date().toLocaleString("th-TH"),
      });
      return;
    }

    const result = parseContextualSalesCsv(csvText);
    const details = {
      ...getParserPreviewDetails(result),
      fetchStatus: "success",
    };

    if (result.status === "stop") {
      clearPreviewTable();
      syncCsvBackedDailyTable(result);
      renderPreviewStatus("stop", details);
      return;
    }

    renderPreviewTable(result);
    syncCsvBackedDailyTable(result);
    renderPreviewStatus("success", details);
  } catch (error) {
    clearPreviewTable();
    restoreSampleDailyTable();
    renderPreviewStatus("failed", {
      fetchStatus: error instanceof Error ? error.message : "network error",
      checkedAt: new Date().toLocaleString("th-TH"),
    });
  }
}

loadLiveCsvPreview();
