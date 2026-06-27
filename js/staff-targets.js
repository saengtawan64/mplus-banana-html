import "./app.js";
import { branches, focusTargets } from "./data-config.js";
import { populateBranchSelect, setCurrentMonth } from "./app.js";
import { formatMoney, targetStatus } from "./metrics.js";

const branchFocusActual = {
  sales: 365000,
  devices: 42,
  remainingDays: 9,
  dailyProgress: [
    { day: 1, value: 18000 },
    { day: 5, value: 82000 },
    { day: 10, value: 146000 },
    { day: 15, value: 215000 },
    { day: 20, value: 286000 },
    { day: 25, value: 334000 },
    { day: 30, value: 365000 },
  ],
};

const targetBranch = document.querySelector("#targetBranch");
const targetMonth = document.querySelector("#targetMonth");

function percent(actual, target) {
  if (!target) return 0;
  return Math.min(Math.round((actual / target) * 100), 100);
}

function progressClass(status) {
  if (status === "green") return "green";
  if (status === "red") return "red";
  return "";
}

function selectedBranchName() {
  const branch = branches.find((item) => item.id === targetBranch?.value) || branches[0];
  return branch?.name || "สาขาตัวอย่าง";
}

function selectedMonthLabel() {
  if (!targetMonth?.value) return "เดือนตัวอย่าง";

  const [year, month] = targetMonth.value.split("-").map(Number);
  if (!year || !month) return "เดือนตัวอย่าง";

  return new Intl.DateTimeFormat("th-TH", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function renderBrandList(target) {
  document.querySelector("#targetBrandList").innerHTML = target.brands
    .map((brand) => `<span class="staff-targets-brand-chip">${brand}</span>`)
    .join("");
}

function renderProgressRing(salesPercent) {
  const ring = document.querySelector("#targetProgressRing");
  ring.innerHTML = `
    <div class="staff-targets-ring" style="--target-progress:${salesPercent}">
      <div class="staff-targets-ring-core">
        <span>${salesPercent}%</span>
        <small>ยอดขาย</small>
      </div>
    </div>
    <p>ความคืบหน้ายอดขายแบรนด์โฟกัสระดับสาขา</p>
  `;
}

function progressCard({ title, value, targetValue, note, status, progress }) {
  return `
    <article class="staff-targets-progress-card">
      <div>
        <p class="metric-meta">${title}</p>
        <strong>${value}</strong>
        <span>เป้า ${targetValue}</span>
      </div>
      <span class="pill ${status}">${progress}%</span>
      <div class="progress-row">
        <div class="progress-head"><span>${note}</span><span>${progress}%</span></div>
        <div class="progress-track"><div class="progress-fill ${progressClass(status)}" style="width:${progress}%"></div></div>
      </div>
    </article>
  `;
}

function renderSummaryCards(target, salesPercent, devicePercent, salesStatus, deviceStatus) {
  document.querySelector("#targetSummaryGrid").innerHTML = [
    progressCard({
      title: "ยอดขายแบรนด์โฟกัส",
      value: formatMoney(branchFocusActual.sales),
      targetValue: formatMoney(target.targetSales),
      note: "ระดับสาขาเท่านั้น",
      status: salesStatus,
      progress: salesPercent,
    }),
    progressCard({
      title: "จำนวนเครื่องแบรนด์โฟกัส",
      value: `${branchFocusActual.devices} เครื่อง`,
      targetValue: `${target.targetDevices} เครื่อง`,
      note: "ไม่นับเป็นยอดรายบุคคล",
      status: deviceStatus,
      progress: devicePercent,
    }),
    `<article class="staff-targets-days-card">
      <p class="metric-meta">วันที่เหลือ</p>
      <strong>${branchFocusActual.remainingDays}</strong>
      <span>วันตัวอย่าง</span>
      <p>ตัวเลขนี้เป็นข้อมูลจำลองสำหรับตรวจหน้าจอ ไม่ใช่ปฏิทินใช้งานจริง</p>
    </article>`,
  ].join("");
}

function chartPoints(points, targetSales) {
  const width = 640;
  const height = 210;
  const padding = 22;
  const maxDay = Math.max(...points.map((point) => point.day), 31);
  const maxValue = Math.max(targetSales, ...points.map((point) => point.value));

  return points.map((point) => {
    const x = padding + (point.day / maxDay) * (width - padding * 2);
    const y = height - padding - (point.value / maxValue) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

function renderCumulativeChart(target) {
  const points = chartPoints(branchFocusActual.dailyProgress, target.targetSales);
  const areaPoints = [`22,188`, ...points, `618,188`].join(" ");
  const linePoints = points.join(" ");
  const latest = branchFocusActual.dailyProgress[branchFocusActual.dailyProgress.length - 1];

  document.querySelector("#targetCumulativeChart").innerHTML = `
    <svg viewBox="0 0 640 230" role="img" aria-label="กราฟสะสมยอดขายตัวอย่างรายวัน">
      <defs>
        <linearGradient id="targetChartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.38"></stop>
          <stop offset="100%" stop-color="#86efac" stop-opacity="0.08"></stop>
        </linearGradient>
      </defs>
      <line x1="22" y1="188" x2="618" y2="188" class="staff-targets-chart-axis"></line>
      <line x1="22" y1="34" x2="618" y2="34" class="staff-targets-chart-guide"></line>
      <polygon points="${areaPoints}" class="staff-targets-chart-area"></polygon>
      <polyline points="${linePoints}" class="staff-targets-chart-line"></polyline>
      ${points
        .map((point) => {
          const [x, y] = point.split(",");
          return `<circle cx="${x}" cy="${y}" r="5" class="staff-targets-chart-dot"></circle>`;
        })
        .join("")}
      <text x="22" y="218">วันที่ 1</text>
      <text x="558" y="218">วันที่ ${latest.day}</text>
      <text x="22" y="24">เป้าตัวอย่าง ${formatMoney(target.targetSales)}</text>
    </svg>
    <p>เส้นสะสมนี้เป็นข้อมูลตัวอย่างสำหรับตรวจเลย์เอาต์เท่านั้น ยังไม่เชื่อมต่อ CSV จริง</p>
  `;
}

function renderTargets() {
  const target = focusTargets[0];
  const salesStatus = targetStatus(branchFocusActual.sales, target.targetSales);
  const deviceStatus = targetStatus(branchFocusActual.devices, target.targetDevices);
  const salesPercent = percent(branchFocusActual.sales, target.targetSales);
  const devicePercent = percent(branchFocusActual.devices, target.targetDevices);

  document.querySelector("#targetHeroTitle").textContent = target.brands.join(" + ");
  document.querySelector("#targetHeroContext").textContent = `${selectedBranchName()} / ${selectedMonthLabel()} / ข้อมูลตัวอย่างระดับสาขา`;

  renderBrandList(target);
  renderProgressRing(salesPercent);
  renderSummaryCards(target, salesPercent, devicePercent, salesStatus, deviceStatus);
  renderCumulativeChart(target);
}

populateBranchSelect(targetBranch);
setCurrentMonth(targetMonth);
renderTargets();

targetBranch?.addEventListener("change", renderTargets);
targetMonth?.addEventListener("change", renderTargets);
