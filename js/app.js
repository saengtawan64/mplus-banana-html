import { branches } from "./data-config.js";
import { getSession, setSession } from "./auth-lite.js";
import { roleOptions } from "./roles.js";

export const navItems = [
  ["dashboard", "ยอดขาย", "dashboard.html"],
  ["reports", "รายงาน", "reports.html"],
  ["compare", "เปรียบเทียบ", "compare.html"],
  ["staff-targets", "เป้าสาขา", "staff-targets.html"],
  ["branches", "สาขา", "branches.html"],
  ["mapping", "จับคู่ CSV", "mapping.html"],
  ["export", "คัดลอกสรุป", "export.html"],
];

const bottomNavItems = [
  ["home", "หน้าแรก", "index.html"],
  ["dashboard", "ยอดขาย", "dashboard.html"],
  ["reports", "รายงาน", "reports.html"],
  ["staff-targets", "เป้าสาขา", "staff-targets.html"],
  ["export", "สรุป", "export.html"],
];

export function renderNavigation() {
  const current = document.body.dataset.page;
  document.querySelectorAll(".top-nav").forEach((nav) => {
    nav.innerHTML = navItems
      .map(([key, label, href]) => `<a href="${href}" ${key === current ? 'aria-current="page"' : ""}>${label}</a>`)
      .join("");
  });
}

function renderBottomNavigation() {
  if (document.querySelector(".bottom-nav")) return;
  const current = document.body.dataset.page;
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "เมนูหลักบนมือถือ");
  nav.innerHTML = bottomNavItems
    .map(([key, label, href]) => `<a href="${href}" ${key === current ? 'aria-current="page"' : ""}>${label}</a>`)
    .join("");
  document.body.classList.add("has-bottom-nav");
  document.body.append(nav);
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
    ["วันที่", "จำเป็นสำหรับกรองช่วงเวลา"],
    ["ยอดในระบบ", "รวมในยอดขายรวม"],
    ["ยอดนอกระบบ", "รวมในยอดขายรวม"],
    ["ยอดจัด", "ข้อมูลประกอบเท่านั้น"],
    ["จำนวนสัญญา", "ข้อมูลประกอบเท่านั้น"],
  ]
    .map(([name, note]) => `<div class="list-item"><strong>${name}</strong><span class="pill gray">${note}</span></div>`)
    .join("");
}

renderNavigation();
renderBottomNavigation();
bootHomeControls();
bootMappingPreview();
