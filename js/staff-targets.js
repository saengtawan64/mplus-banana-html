import "./app.js";
import { focusTargets } from "./data-config.js";
import { populateBranchSelect, setCurrentMonth } from "./app.js";
import { formatMoney, targetStatus } from "./metrics.js";

const branchFocusActual = {
  sales: 365000,
  devices: 42,
};

function percent(actual, target) {
  if (!target) return 0;
  return Math.min(Math.round((actual / target) * 100), 100);
}

function progressClass(status) {
  if (status === "green") return "green";
  if (status === "red") return "red";
  return "";
}

function renderTargets() {
  const target = focusTargets[0];
  const salesStatus = targetStatus(branchFocusActual.sales, target.targetSales);
  const deviceStatus = targetStatus(branchFocusActual.devices, target.targetDevices);
  const salesPercent = percent(branchFocusActual.sales, target.targetSales);
  const devicePercent = percent(branchFocusActual.devices, target.targetDevices);
  const cards = [
    ["แบรนด์โฟกัส", target.brands.join(" + "), "กลุ่มแบรนด์ระดับสาขา", "gray", null],
    ["ความคืบหน้ายอดขาย", `${formatMoney(branchFocusActual.sales)} / ${formatMoney(target.targetSales)}`, "ยอดแบรนด์โฟกัสระดับสาขา", salesStatus, salesPercent],
    ["ความคืบหน้าจำนวนเครื่อง", `${branchFocusActual.devices} / ${target.targetDevices}`, "จำนวนเครื่องแบรนด์โฟกัสระดับสาขา", deviceStatus, devicePercent],
    ["การนับยอด", "ระดับสาขาเท่านั้น", "ไม่ใช่ยอดขายรายบุคคล", "gray", null],
  ];

  document.querySelector("#targetCards").innerHTML = cards
    .map(([title, value, note, status, progress]) => {
      const progressMarkup =
        progress === null
          ? ""
          : `<div class="progress-row">
              <div class="progress-head"><span>${note}</span><span>${progress}%</span></div>
              <div class="progress-track"><div class="progress-fill ${progressClass(status)}" style="width:${progress}%"></div></div>
            </div>`;
      return `<article class="metric-card ${progress === null ? "" : "target-progress-card"}">
        <p class="metric-meta">${title}</p>
        <strong>${value}</strong>
        <p><span class="pill ${status}">${note}</span></p>
        ${progressMarkup}
      </article>`;
    })
    .join("");
}

populateBranchSelect(document.querySelector("#targetBranch"));
setCurrentMonth(document.querySelector("#targetMonth"));
renderTargets();
