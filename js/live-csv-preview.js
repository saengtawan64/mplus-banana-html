import { parseContextualSalesCsv } from "./contextual-csv-mapping.js";

const LIVE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vScmRS5VCtLON--xd_4FnRvUAV8pASPi8bPOq57jYStFzh0C97JtaisyOLjoGyIecYXhyIDceK4-7Jh/pub?gid=614260076&single=true&output=csv";

const statusText = {
  loading: "กำลังตรวจ CSV แบบ read-only...",
  success: "อ่าน CSV ได้แล้ว แต่ยังเป็น Preview เท่านั้น ยังไม่แทน Dashboard",
  stop: "อ่าน CSV ได้ แต่โครงสร้างยังไม่พร้อมใช้งาน",
  failed: "ไม่สามารถโหลด CSV ได้ กำลังแสดง Dashboard ตัวอย่างเหมือนเดิม",
};

const fallbackNote = "Dashboard cards/charts/tables ยังใช้ข้อมูลตัวอย่างเดิม";

function getPreviewElements() {
  return {
    panel: document.querySelector("#liveCsvPreviewPanel"),
    status: document.querySelector("#liveCsvPreviewStatus"),
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

  try {
    const response = await fetch(getCacheBustedUrl(LIVE_CSV_URL), { cache: "no-store" });
    if (!response.ok) {
      renderPreviewStatus("failed", {
        fetchStatus: `HTTP ${response.status}`,
        checkedAt: new Date().toLocaleString("th-TH"),
      });
      return;
    }

    const csvText = await response.text();
    if (!csvText.trim()) {
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
      renderPreviewStatus("stop", details);
      return;
    }

    renderPreviewStatus("success", details);
  } catch (error) {
    renderPreviewStatus("failed", {
      fetchStatus: error instanceof Error ? error.message : "network error",
      checkedAt: new Date().toLocaleString("th-TH"),
    });
  }
}

loadLiveCsvPreview();
