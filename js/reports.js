import "./app.js";
import { populateBranchSelect, setCurrentMonth } from "./app.js";
import { calculateSales, formatMoney } from "./metrics.js";

const reportRows = [
  { date: "2026-06-01", branch: "สาขาตัวอย่าง", systemSales: "120000", outsideSystemSales: "32000", deviceCount: "14", financeAmount: "45000", contractCount: "3" },
  { date: "2026-06-02", branch: "สาขาตัวอย่าง", systemSales: "0", outsideSystemSales: "18000", deviceCount: "0", financeAmount: "0", contractCount: "0" },
  null,
];

function renderReports() {
  document.querySelector("#reportRows").innerHTML = reportRows
    .map((row) => {
      const metric = calculateSales(row);
      if (metric.status === "missing") {
        return `<tr class="missing-row"><td colspan="7">ข้อมูลหายหรือยังไม่ได้จับคู่หัวคอลัมน์ ข้อมูลนี้ไม่ถือว่าเป็นค่า 0</td></tr>`;
      }
      return `<tr>
        <td>${row.date}</td>
        <td>${row.branch}</td>
        <td class="amount-cell">${formatMoney(metric.totalSales)}</td>
        <td class="amount-cell">${formatMoney(metric.systemSales.value)}</td>
        <td class="amount-cell">${formatMoney(metric.outsideSystemSales.value)}</td>
        <td>ยอดจัด ${formatMoney(metric.financeAmount.value)} / สัญญา ${metric.contractCount.value}</td>
        <td><span class="pill yellow">ข้อมูลตัวอย่าง</span></td>
      </tr>`;
    })
    .join("");
}

populateBranchSelect(document.querySelector("#reportBranch"));
setCurrentMonth(document.querySelector("#reportMonth"));
renderReports();
