import "./app.js";
import { branches } from "./data-config.js";
import { populateBranchSelect, setCurrentMonth } from "./app.js";
import { loadPublishedCsv } from "./csv-loader.js";
import { detectMapping, mapRows } from "./csv-mapping.js";
import { calculateSales, formatMoney } from "./metrics.js";
import { loadChartJs } from "../vendor/chartjs-loader.js";

const sampleRows = [
  { date: "2026-06-01", systemSales: "120000", outsideSystemSales: "32000", deviceCount: "14", financeAmount: "45000", contractCount: "3" },
  { date: "2026-06-02", systemSales: "0", outsideSystemSales: "18000", deviceCount: "0", financeAmount: "0", contractCount: "0" },
];

const SAMPLE_DATA_LABEL = "Prototype sample data only - not real CSV data.";

function renderCards(metric) {
  const cards = [
    ["Total sales", metric.status === "ok" ? formatMoney(metric.totalSales) : "No data", "system + outside only", "featured", "yellow"],
    ["System sales", formatMoney(metric.systemSales?.value), "included in total", "", "green"],
    ["Outside-system sales", formatMoney(metric.outsideSystemSales?.value), "included in total", "", "yellow"],
    ["Supporting metrics", `${formatMoney(metric.financeAmount?.value)} / ${metric.contractCount?.value ?? "No data"}`, "not included in total", "", "gray"],
  ];
  document.querySelector("#dashboardCards").innerHTML = cards
    .map(
      ([title, value, note, className, pill]) => `<article class="metric-card ${className}">
        <p class="metric-meta">${title}</p>
        <strong>${value}</strong>
        <p class="metric-note"><span class="pill ${pill}">${note}</span></p>
      </article>`,
    )
    .join("");
}

async function renderCharts(metric) {
  const Chart = await loadChartJs();
  if (!Chart || metric.status !== "ok") return;

  new Chart(document.querySelector("#salesTrendChart"), {
    type: "bar",
    data: {
      labels: ["System", "Outside"],
      datasets: [{ label: "Sales", data: [metric.systemSales.value, metric.outsideSystemSales.value], backgroundColor: ["#1f7a5a", "#2d65a3"] }],
    },
    options: { responsive: true, plugins: { legend: { display: false } } },
  });

  new Chart(document.querySelector("#salesMixChart"), {
    type: "doughnut",
    data: {
      labels: ["System", "Outside"],
      datasets: [{ data: [metric.systemSales.value, metric.outsideSystemSales.value], backgroundColor: ["#1f7a5a", "#f0b44c"] }],
    },
    options: { responsive: true },
  });
}

async function loadDashboard() {
  const branchId = document.querySelector("#branchFilter").value;
  const branch = branches.find((item) => item.id === branchId) || branches[0];
  const year = new Date().getFullYear();
  const status = document.querySelector("#dataStatus");
  const result = await loadPublishedCsv(branch.csvByYear[year]);

  if (result.status !== "ok") {
    status.className = "notice warn";
    status.textContent = `${result.message} ${SAMPLE_DATA_LABEL}`;
  }

  const rows = result.status === "ok" ? result.rows : sampleRows;
  const headers = Object.keys(rows[0] || {});
  const mapping = detectMapping(headers);
  const mappedRows = mapRows(rows, mapping);
  const metric = calculateSales(mappedRows[0]);

  if (!mapping.complete) {
    status.className = "notice warn";
    status.textContent = `Mapping incomplete: ${mapping.missing.join(", ")}. Missing fields are treated as no data.`;
  } else if (result.status === "ok") {
    status.className = "notice ok";
    status.textContent = "CSV loaded and mapped by header.";
  }

  renderCards(metric);
  renderCharts(metric);
}

populateBranchSelect(document.querySelector("#branchFilter"));
setCurrentMonth(document.querySelector("#periodFilter"));
document.querySelector("#refreshData").addEventListener("click", loadDashboard);
loadDashboard();
