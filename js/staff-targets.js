import "./app.js";
import { focusTargets } from "./data-config.js";
import { populateBranchSelect, setCurrentMonth } from "./app.js";
import { formatMoney, targetStatus } from "./metrics.js";

const branchFocusActual = {
  sales: 365000,
  devices: 42,
};

function renderTargets() {
  const target = focusTargets[0];
  const salesStatus = targetStatus(branchFocusActual.sales, target.targetSales);
  const deviceStatus = targetStatus(branchFocusActual.devices, target.targetDevices);
  const cards = [
    ["Focus brands", target.brands.join(" + "), "branch-level focus group", "gray"],
    ["Sales progress", `${formatMoney(branchFocusActual.sales)} / ${formatMoney(target.targetSales)}`, "branch focus-brand sales", salesStatus],
    ["Device progress", `${branchFocusActual.devices} / ${target.targetDevices}`, "branch focus-brand devices", deviceStatus],
    ["Attribution", "Branch level only", "not personal staff sales", "gray"],
  ];

  document.querySelector("#targetCards").innerHTML = cards
    .map(([title, value, note, status]) => `<article class="metric-card"><p>${title}</p><strong>${value}</strong><p><span class="pill ${status}">${note}</span></p></article>`)
    .join("");
}

populateBranchSelect(document.querySelector("#targetBranch"));
setCurrentMonth(document.querySelector("#targetMonth"));
renderTargets();
