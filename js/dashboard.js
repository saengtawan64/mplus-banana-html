import "./app.js";
import { branches } from "./data-config.js";
import { populateBranchSelect, setCurrentMonth } from "./app.js";
import { loadPublishedCsv } from "./csv-loader.js";
import { detectMapping, mapRows } from "./csv-mapping.js";
import { calculateSales, formatMoney } from "./metrics.js";
import { loadChartJs } from "../vendor/chartjs-loader.js";

const SAMPLE_DATA_LABEL = "ข้อมูลตัวอย่างเท่านั้น ยังไม่ใช่ยอดขายจริงจาก CSV";

const sampleDailyRows = [
  { date: "2026-06-01", systemSales: "120000", outsideSystemSales: "32000", financeAmount: "45000", contractCount: "3", profit: "11000" },
  { date: "2026-06-02", systemSales: "0", outsideSystemSales: "18000", financeAmount: "0", contractCount: "0", profit: "0" },
  { date: "2026-06-03", systemSales: "148000", outsideSystemSales: "42000", financeAmount: "52000", contractCount: "4", profit: "16800" },
  { date: "2026-06-04", systemSales: "132000", outsideSystemSales: "36000", financeAmount: "48000", contractCount: "2", profit: "12400" },
  { date: "2026-06-05", systemSales: "156000", outsideSystemSales: "31000", financeAmount: "58000", contractCount: "5", profit: "18300" },
  { date: "2026-06-06", systemSales: "141000", outsideSystemSales: "39000", financeAmount: "51000", contractCount: "3", profit: "15100" },
  null,
  { date: "2026-06-08", state: "future" },
];

const sampleMonthlyRows = [
  { label: "ม.ค.", system: 820000, outside: 180000 },
  { label: "ก.พ.", system: 875000, outside: 210000 },
  { label: "มี.ค.", system: 910000, outside: 195000 },
  { label: "เม.ย.", system: 940000, outside: 228000 },
  { label: "พ.ค.", system: 980000, outside: 244000 },
  { label: "มิ.ย.", system: 817000, outside: 198000 },
];

const focusTargets = [
  { label: "ยอดขายแบรนด์โฟกัส", actual: 410000, target: 650000, unit: "money" },
  { label: "จำนวนเครื่องแบรนด์โฟกัส", actual: 46, target: 72, unit: "count" },
];

let monthlyChart;
let activeMonthlyMetric = "total";

function visualRowsFromMappedRows(mappedRows) {
  const safeRows = mappedRows.filter((row) => calculateSales(row).status === "ok");
  if (!safeRows.length) return sampleDailyRows;

  return [
    ...safeRows.slice(0, 6),
    null,
    { date: "2026-06-08", state: "future" },
  ];
}

function validSalesRows(rows) {
  return rows.filter((row) => row && !row.state);
}

function metricForRow(row) {
  return calculateSales(row);
}

function totalForRow(row) {
  const metric = metricForRow(row);
  return metric.status === "ok" ? metric.totalSales : null;
}

function summarizeRows(rows) {
  return rows.reduce(
    (summary, row) => {
      const metric = metricForRow(row);
      if (metric.status !== "ok") return summary;
      return {
        systemSales: summary.systemSales + metric.systemSales.value,
        outsideSystemSales: summary.outsideSystemSales + metric.outsideSystemSales.value,
        financeAmount: summary.financeAmount + metric.financeAmount.value,
        contractCount: summary.contractCount + metric.contractCount.value,
        profit: summary.profit + Number(row.profit || 0),
      };
    },
    { systemSales: 0, outsideSystemSales: 0, financeAmount: 0, contractCount: 0, profit: 0 },
  );
}

function formatValue(value, type = "money") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "ไม่พบข้อมูล";
  return type === "count" ? Number(value).toLocaleString("th-TH") : formatMoney(Number(value));
}

function renderSummaryCards(summary, useSampleVisuals) {
  const totalSales = summary.systemSales + summary.outsideSystemSales;
  const sourceLabel = useSampleVisuals ? SAMPLE_DATA_LABEL : "ยอดขายจาก CSV ที่จับคู่หัวคอลัมน์แล้ว";

  document.querySelector("#totalSalesCard").innerHTML = `
    <p class="metric-meta">ยอดขายรวม</p>
    <strong>${formatMoney(totalSales)}</strong>
    <p class="metric-note"><span class="pill yellow">ยอดขายรวม = ยอดในระบบ + ยอดนอกระบบ</span></p>
    <p>${sourceLabel}</p>
  `;

  document.querySelector("#salesBreakdownCards").innerHTML = [
    ["ยอดในระบบ", summary.systemSales, "รวมในยอดขายรวม", "green"],
    ["ยอดนอกระบบ", summary.outsideSystemSales, "รวมในยอดขายรวม", "yellow"],
  ]
    .map(
      ([title, value, note, pill]) => `<article class="metric-card compact-metric">
        <p class="metric-meta">${title}</p>
        <strong>${formatMoney(value)}</strong>
        <p class="metric-note"><span class="pill ${pill}">${note}</span></p>
      </article>`,
    )
    .join("");
}

function renderSupportingMetrics(summary) {
  const items = [
    ["ยอดจัด", formatMoney(summary.financeAmount)],
    ["จำนวนสัญญา", `${summary.contractCount.toLocaleString("th-TH")} สัญญา`],
    ["กำไร", formatMoney(summary.profit)],
  ];

  document.querySelector("#supportMetrics").innerHTML = items
    .map(
      ([label, value]) => `<div class="support-metric">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>`,
    )
    .join("");
}

function progressPercent(actual, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((actual / target) * 100));
}

function renderFocusProgress() {
  document.querySelector("#focusProgress").innerHTML = focusTargets
    .map((item) => {
      const percent = progressPercent(item.actual, item.target);
      return `<div class="progress-row focus-progress-row">
        <div class="progress-head">
          <span>${item.label}</span>
          <strong>${percent}%</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill green" style="width: ${percent}%"></div>
        </div>
        <p>${formatValue(item.actual, item.unit)} / ${formatValue(item.target, item.unit)} ระดับสาขาเท่านั้น</p>
      </div>`;
    })
    .join("");
}

function renderRecentBars(rows) {
  const recentRows = rows.slice(0, 6);
  const maxTotal = Math.max(...recentRows.map((row) => totalForRow(row) || 0), 1);

  document.querySelector("#recentSalesBars").innerHTML = recentRows
    .map((row) => {
      const total = totalForRow(row) || 0;
      const percent = Math.max(4, Math.round((total / maxTotal) * 100));
      return `<div class="mini-bar-item">
        <div class="mini-bar-value">${formatMoney(total)}</div>
        <div class="mini-bar-track">
          <div class="mini-bar-fill" style="height: ${percent}%"></div>
        </div>
        <span>${row.date.slice(5)}</span>
      </div>`;
    })
    .join("");
}

function metricValueForMonth(row, metric) {
  if (metric === "system") return row.system;
  if (metric === "outside") return row.outside;
  return row.system + row.outside;
}

function monthlyDataset(metric) {
  return sampleMonthlyRows.map((row) => metricValueForMonth(row, metric));
}

function monthlyLabel(metric) {
  if (metric === "system") return "ยอดในระบบ";
  if (metric === "outside") return "ยอดนอกระบบ";
  return "ยอดรวม";
}

async function renderMonthlyChart() {
  const fallback = document.querySelector("#monthlyChartFallback");
  const Chart = await loadChartJs();
  if (!Chart) {
    fallback.hidden = false;
    return;
  }

  fallback.hidden = true;
  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(document.querySelector("#monthlyCompareChart"), {
    type: "line",
    data: {
      labels: sampleMonthlyRows.map((row) => row.label),
      datasets: [
        {
          label: monthlyLabel(activeMonthlyMetric),
          data: monthlyDataset(activeMonthlyMetric),
          borderColor: "#1f7a5a",
          backgroundColor: "rgba(134, 239, 172, 0.28)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

function renderDailyTable(rows) {
  let previousTotal = null;
  document.querySelector("#dailySalesRows").innerHTML = rows
    .map((row) => {
      if (!row) {
        return `<tr class="missing-row"><td colspan="5">ไม่พบข้อมูล</td></tr>`;
      }

      if (row.state === "future") {
        return `<tr class="missing-row"><td>${row.date}</td><td colspan="4">ยังไม่มีข้อมูล</td></tr>`;
      }

      const metric = metricForRow(row);
      if (metric.status !== "ok") {
        return `<tr class="missing-row"><td>${row.date}</td><td colspan="4">ไม่พบข้อมูล</td></tr>`;
      }

      const total = metric.totalSales;
      const change = previousTotal === null ? "ไม่มีข้อมูลเปรียบเทียบ" : total - previousTotal;
      previousTotal = total;
      const changeClass = typeof change === "number" && change < 0 ? "red" : "green";
      const changeLabel =
        typeof change === "number"
          ? `${change >= 0 ? "+" : ""}${formatMoney(change)}`
          : change;

      return `<tr>
        <td>${row.date}</td>
        <td class="amount-cell">${formatMoney(total)}</td>
        <td class="amount-cell">${formatValue(metric.systemSales.value)}</td>
        <td class="amount-cell">${formatValue(metric.outsideSystemSales.value)}</td>
        <td><span class="pill ${typeof change === "number" ? changeClass : "gray"}">${changeLabel}</span></td>
      </tr>`;
    })
    .join("");
}

function bindMonthlyTabs() {
  document.querySelectorAll("[data-monthly-metric]").forEach((button) => {
    button.addEventListener("click", () => {
      activeMonthlyMetric = button.dataset.monthlyMetric;
      document.querySelectorAll("[data-monthly-metric]").forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });
      renderMonthlyChart();
    });
  });
}

function renderDashboard(rows, options = {}) {
  const useSampleVisuals = options.useSampleVisuals ?? true;
  const visualRows = useSampleVisuals ? sampleDailyRows : visualRowsFromMappedRows(rows);
  const rowsForSummary = validSalesRows(visualRows);
  const summary = summarizeRows(rows);

  renderSummaryCards(summary, useSampleVisuals);
  renderSupportingMetrics(summary);
  renderFocusProgress();
  renderRecentBars(rowsForSummary);
  renderDailyTable(visualRows);
  renderMonthlyChart();
}

async function loadDashboard() {
  const branchId = document.querySelector("#branchFilter").value;
  const branch = branches.find((item) => item.id === branchId) || branches[0];
  const year = new Date().getFullYear();
  const status = document.querySelector("#dataStatus");
  const result = await loadPublishedCsv(branch.csvByYear[year]);
  let rows = sampleDailyRows;
  let useSampleVisuals = true;

  if (result.status !== "ok") {
    status.className = "notice warn";
    status.textContent = `${result.message} ยังไม่เชื่อม CSV จริง กำลังแสดงข้อมูลตัวอย่างสำหรับต้นแบบ Phase 1`;
  } else {
    const headers = Object.keys(result.rows[0] || {});
    const mapping = detectMapping(headers);

    if (!mapping.complete) {
      status.className = "notice warn";
      status.textContent = `ยังจับคู่หัวคอลัมน์ไม่ครบ: ${mapping.missing.join(", ")} ข้อมูลที่ขาดจะถือว่าไม่พบข้อมูล ไม่ใช่ค่า 0 กำลังแสดงข้อมูลตัวอย่างสำหรับต้นแบบ Phase 1`;
    } else {
      const mappedRows = mapRows(result.rows, mapping);
      const safeRows = mappedRows.filter((row) => calculateSales(row).status === "ok");
      if (safeRows.length) {
        status.className = "notice ok";
        status.textContent = "โหลด CSV และจับคู่จากหัวคอลัมน์แล้ว ส่วนกราฟแท่ง เป้าสาขา และกราฟรายเดือนยังเป็นข้อมูลตัวอย่างสำหรับต้นแบบ";
        rows = safeRows;
        useSampleVisuals = false;
      } else {
        status.className = "notice warn";
        status.textContent = "โหลด CSV แล้ว แต่ไม่พบแถวที่ใช้คำนวณยอดขายได้ ข้อมูลที่ขาดถือว่าไม่พบข้อมูล ไม่ใช่ค่า 0 กำลังแสดงข้อมูลตัวอย่างสำหรับต้นแบบ Phase 1";
      }
    }
  }

  renderDashboard(rows, { useSampleVisuals });
}

populateBranchSelect(document.querySelector("#branchFilter"));
setCurrentMonth(document.querySelector("#periodFilter"));
bindMonthlyTabs();
document.querySelector("#refreshData").addEventListener("click", loadDashboard);
loadDashboard();
