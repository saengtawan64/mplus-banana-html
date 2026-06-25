import { branches } from "./data-config.js";
import { getSession, setSession } from "./auth-lite.js";
import { roleOptions } from "./roles.js";

export const navItems = [
  ["dashboard", "Dashboard", "dashboard.html"],
  ["reports", "Reports", "reports.html"],
  ["compare", "Compare", "compare.html"],
  ["staff-targets", "Targets", "staff-targets.html"],
  ["branches", "Branches", "branches.html"],
  ["mapping", "Mapping", "mapping.html"],
  ["export", "Copy", "export.html"],
];

export function renderNavigation() {
  const current = document.body.dataset.page;
  document.querySelectorAll(".top-nav").forEach((nav) => {
    nav.innerHTML = navItems
      .map(([key, label, href]) => `<a href="${href}" ${key === current ? 'aria-current="page"' : ""}>${label}</a>`)
      .join("");
  });
}

export function populateBranchSelect(select, selectedBranchId = getSession().branchId) {
  if (!select) return;
  select.innerHTML = branches
    .map((branch) => `<option value="${branch.id}" ${branch.id === selectedBranchId ? "selected" : ""}>${branch.name}</option>`)
    .join("");
}

export function setCurrentMonth(input) {
  if (input && !input.value) input.value = new Date().toISOString().slice(0, 7);
}

function bootHomeControls() {
  const roleSelect = document.querySelector("#roleSelect");
  const branchSelect = document.querySelector("#branchSelect");
  if (!roleSelect || !branchSelect) return;

  const session = getSession();
  roleSelect.innerHTML = roleOptions()
    .map((role) => `<option value="${role.key}" ${role.key === session.roleKey ? "selected" : ""}>${role.label}</option>`)
    .join("");
  populateBranchSelect(branchSelect, session.branchId);

  roleSelect.addEventListener("change", () => setSession({ roleKey: roleSelect.value }));
  branchSelect.addEventListener("change", () => setSession({ branchId: branchSelect.value }));
}

function bootMappingPreview() {
  const target = document.querySelector("#mappingStatus");
  if (!target) return;
  target.innerHTML = [
    ["Date", "Required for time filtering"],
    ["System sales", "Included in total sales"],
    ["Outside-system sales", "Included in total sales"],
    ["Finance amount", "Supporting metric only"],
    ["Contract count", "Supporting metric only"],
  ]
    .map(([name, note]) => `<div class="list-item"><strong>${name}</strong><span class="pill gray">${note}</span></div>`)
    .join("");
}

renderNavigation();
bootHomeControls();
bootMappingPreview();
