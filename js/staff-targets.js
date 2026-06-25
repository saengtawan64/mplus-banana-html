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
    ["Focus brands", target.brands.join(" + "), "branch-level focus group", "gray", null],
    ["Sales progress", `${formatMoney(branchFocusActual.sales)} / ${formatMoney(target.targetSales)}`, "branch focus-brand sales", salesStatus, salesPercent],
    ["Device progress", `${branchFocusActual.devices} / ${target.targetDevices}`, "branch focus-brand devices", deviceStatus, devicePercent],
    ["Attribution", "Branch level only", "not personal staff sales", "gray", null],
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
