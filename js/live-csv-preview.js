import { parseContextualSalesCsv } from "./contextual-csv-mapping.js";

const LIVE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vScmRS5VCtLON--xd_4FnRvUAV8pASPi8bPOq57jYStFzh0C97JtaisyOLjoGyIecYXhyIDceK4-7Jh/pub?gid=614260076&single=true&output=csv";

const statusText = {
  loading: "กำลังตรวจ CSV แบบ read-only...",
  success: "อ่าน CSV ได้แล้ว แต่ยังเป็น Preview เท่านั้น ยังไม่แทน Dashboard",
  stop: "อ่าน CSV ได้ แต่โครงสร้างยังไม่พร้อมใช้งาน",
  failed: "ไม่สามารถโหลด CSV ได้ กำลังแสดง Dashboard ตัวอย่างเหมือนเดิม",
};

const fallbackNote = "Dashboard cards/charts/tables ยังใช้ข้อมูลตัวอย่างเดิม";
const dailyTableFallbackText = "กำลังแสดงตาราง Dashboard ตัวอย่างเหมือนเดิม";
const dailyTableCsvReadyText = "แหล่งข้อมูล: CSV ตรวจสอบแล้ว";
const dailyTableCsvWarningText = "แหล่งข้อมูล: CSV Preview / มีบางแถวต้องตรวจสอบ — ตาราง Dashboard ยังใช้ข้อมูลตัวอย่าง";

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

function renderPreviewStatus(state, details = {}) {
  const { status } = getPreviewElements();
  if (!status) return;

  const lines = [
    statusText[state] || statusText.failed,
    "สถานะ: Preview เท่านั้น",
    fallbackNote,
  ];

  if (details.fetchStatus) lines.push(`Fetch: ${details.fetchStatus}`);
  if (details.parserStatus) lines.push(`Parser: ${details.parserStatus}`);
  if (typeof details.draftRowCount === "number") lines.push(`Draft rows: ${details.draftRowCount}`);
  if (typeof details.warningCount === "number") lines.push(`Warnings: ${details.warningCount}`);
  if (typeof details.errorCount === "number") lines.push(`Errors: ${details.errorCount}`);
  if (details.checkedAt) lines.push(`ตรวจล่าสุด: ${details.checkedAt}`);

  status.textContent = lines.join(" | ");
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

function setDailyTableNote(message) {
  const { note } = getDailyTableElements();
  if (note) note.textContent = message;
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
  setDailyTableNote(noteText);
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
  setDailyTableNote(dailyTableCsvReadyText);
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
