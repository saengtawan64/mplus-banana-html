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

const shellNavItems = [["home", "Command Center", "index.html"], ...navItems];

export function renderNavigation() {
  const current = document.body.dataset.page;
  document.querySelectorAll(".top-nav").forEach((nav) => {
    nav.innerHTML = navItems
      .map(
        ([key, label, href]) =>
          `<a class="nav-link" href="${href}" ${key === current ? 'aria-current="page"' : ""}>` +
          `<span class="nav-link-dot" aria-hidden="true"></span>` +
          `<span>${label}</span>` +
          `</a>`,
      )
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
    .map(
      ([key, label, href]) =>
        `<a href="${href}" ${key === current ? 'aria-current="page"' : ""}>` +
        `<span class="bottom-nav-icon" aria-hidden="true"></span>` +
        `<span>${label}</span>` +
        `</a>`,
    )
    .join("");
  document.body.classList.add("has-bottom-nav");
  document.body.append(nav);
}

function isShellV2Enabled() {
  return document.body.dataset.shell === "v2" || document.body.classList.contains("app-shell-v2");
}

function navLinkClass(key, current, baseClass) {
  return `${baseClass}${key === current ? " shell-active" : ""}`;
}

function renderShellNavLinks(baseClass) {
  const current = document.body.dataset.page;
  return shellNavItems
    .map(
      ([key, label, href]) =>
        `<a class="${navLinkClass(key, current, baseClass)}" href="${href}" ${key === current ? 'aria-current="page"' : ""}>` +
        `<span class="shell-nav-marker" aria-hidden="true"></span>` +
        `<span>${label}</span>` +
        `</a>`,
    )
    .join("");
}

function setMobileMenuOpen(button, overlay, isOpen) {
  button.setAttribute("aria-expanded", String(isOpen));
  button.classList.toggle("is-open", isOpen);
  overlay.hidden = !isOpen;
  overlay.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("mobile-menu-open", isOpen);
}

function renderAppShellV2() {
  if (!isShellV2Enabled() || document.querySelector(".sidebar-shell")) return;

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar-shell";
  sidebar.setAttribute("aria-label", "Premium App Shell navigation");
  sidebar.innerHTML = `
    <div class="sidebar-shell-header">
      <a class="sidebar-brand" href="index.html">
        <span class="sidebar-brand-mark" aria-hidden="true"></span>
        <span>
          <strong>Mplus Banana</strong>
          <small>Light v2 pilot</small>
        </span>
      </a>
      <div class="sidebar-context">
        <span>Prototype workspace</span>
        <strong>Sample data only</strong>
      </div>
    </div>
    <nav class="sidebar-nav" aria-label="Premium workspace navigation">
      <p class="sidebar-nav-section">Workspace</p>
      ${renderShellNavLinks("sidebar-nav-link")}
    </nav>
    <div class="sidebar-shell-footer">
      <span class="sidebar-status-dot" aria-hidden="true"></span>
      <span>No backend / API</span>
    </div>
  `;

  const mobileBar = document.createElement("div");
  mobileBar.className = "mobile-shell-bar";
  mobileBar.innerHTML = `
    <a class="mobile-shell-brand" href="index.html">
      <span class="mobile-shell-mark" aria-hidden="true"></span>
      <span>Mplus Banana</span>
    </a>
    <button class="mobile-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileMenuOverlay">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  `;

  const overlay = document.createElement("nav");
  overlay.className = "mobile-menu-overlay";
  overlay.id = "mobileMenuOverlay";
  overlay.hidden = true;
  overlay.setAttribute("aria-label", "Mobile workspace navigation");
  overlay.innerHTML = `
    <div class="mobile-menu-card">
      <p class="sidebar-nav-section">Workspace</p>
      ${renderShellNavLinks("mobile-menu-link")}
      <div class="mobile-menu-note">Sample / prototype only. Current bottom nav remains available during transition.</div>
    </div>
  `;

  document.body.prepend(overlay);
  document.body.prepend(mobileBar);
  document.body.prepend(sidebar);

  const button = mobileBar.querySelector(".mobile-menu-button");
  button.addEventListener("click", () => {
    setMobileMenuOpen(button, overlay, button.getAttribute("aria-expanded") !== "true");
  });

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMobileMenuOpen(button, overlay, false);
  });

  document.addEventListener("click", (event) => {
    if (overlay.hidden) return;
    if (overlay.contains(event.target) || button.contains(event.target)) return;
    setMobileMenuOpen(button, overlay, false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobileMenuOpen(button, overlay, false);
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
renderAppShellV2();
renderBottomNavigation();
bootHomeControls();
bootMappingPreview();
