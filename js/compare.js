import "./app.js";
import { loadChartJs } from "../vendor/chartjs-loader.js";

let chart;

const chartData = {
  labels: ["บานาน่าลานสัก", "บานาน่าด่านช้าง", "บานาน่าบ้านไร่"],
  system: [120000, 96000, 88000],
  outside: [32000, 28000, 23000],
};

function configFor(type) {
  const stacked = type === "stackedBar";
  const chartType = type === "stackedBar" ? "bar" : type;
  return {
    type: chartType,
    data: {
      labels: chartData.labels,
      datasets:
        chartType === "doughnut"
          ? [{ label: "ยอดขายรวม", data: chartData.system.map((value, index) => value + chartData.outside[index]), backgroundColor: ["#1f7a5a", "#2d65a3", "#f0b44c"] }]
          : [
              { label: "ในระบบ", data: chartData.system, backgroundColor: "#1f7a5a", borderColor: "#1f7a5a" },
              { label: "นอกระบบ", data: chartData.outside, backgroundColor: "#f0b44c", borderColor: "#f0b44c" },
            ],
    },
    options: {
      responsive: true,
      scales: chartType === "doughnut" ? {} : { x: { stacked }, y: { stacked, beginAtZero: true } },
    },
  };
}

async function renderCompareChart() {
  const Chart = await loadChartJs();
  if (!Chart) return;
  if (chart) chart.destroy();
  chart = new Chart(document.querySelector("#compareChart"), configFor(document.querySelector("#chartType").value));
}

document.querySelector("#chartType").addEventListener("change", renderCompareChart);
renderCompareChart();
