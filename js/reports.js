import "./app.js";
import { populateBranchSelect, setCurrentMonth } from "./app.js";
import { calculateSales, formatMoney } from "./metrics.js";

const reportRows = [
  { date: "2026-06-01", branch: "Prototype sample branch", systemSales: "120000", outsideSystemSales: "32000", deviceCount: "14", financeAmount: "45000", contractCount: "3" },
  { date: "2026-06-02", branch: "Prototype sample branch", systemSales: "0", outsideSystemSales: "18000", deviceCount: "0", financeAmount: "0", contractCount: "0" },
  null,
];

function renderReports() {
  document.querySelector("#reportRows").innerHTML = reportRows
    .map((row) => {
      const metric = calculateSales(row);
      if (metric.status === "missing") {
        return `<tr class="missing-row"><td colspan="7">Missing row or unmapped data. This is not treated as zero.</td></tr>`;
      }
      return `<tr>
        <td>${row.date}</td>
        <td>${row.branch}</td>
        <td class="amount-cell">${formatMoney(metric.totalSales)}</td>
        <td class="amount-cell">${formatMoney(metric.systemSales.value)}</td>
        <td class="amount-cell">${formatMoney(metric.outsideSystemSales.value)}</td>
        <td>Finance ${formatMoney(metric.financeAmount.value)} / Contracts ${metric.contractCount.value}</td>
        <td><span class="pill yellow">Prototype sample</span></td>
      </tr>`;
    })
    .join("");
}

populateBranchSelect(document.querySelector("#reportBranch"));
setCurrentMonth(document.querySelector("#reportMonth"));
renderReports();
