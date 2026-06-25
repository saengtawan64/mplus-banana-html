import "./app.js";

const sample = {
  branch: "Prototype sample branch",
  period: new Date().toISOString().slice(0, 7),
  totalSales: "152,000",
  systemSales: "120,000",
  outsideSystemSales: "32,000",
  financeAmount: "45,000",
  contractCount: "3",
};

const sampleNotice = "Prototype sample data only - not real CSV data.";

const templates = {
  short: () => `${sampleNotice}\n${sample.branch} ${sample.period}: total sales ${sample.totalSales} baht.`,
  formal: () =>
    `${sampleNotice}\nSales report for ${sample.branch}, period ${sample.period}.\nTotal sales were ${sample.totalSales} baht, from system sales ${sample.systemSales} baht and outside-system sales ${sample.outsideSystemSales} baht.\nFinance amount and contract count are supporting metrics only and are not included in total sales.`,
  line: () =>
    `${sampleNotice}\n${sample.branch}\n\u0e22\u0e2d\u0e14\u0e02\u0e32\u0e22\u0e23\u0e27\u0e21: ${sample.totalSales}\n\u0e43\u0e19\u0e23\u0e30\u0e1a\u0e1a: ${sample.systemSales}\n\u0e19\u0e2d\u0e01\u0e23\u0e30\u0e1a\u0e1a: ${sample.outsideSystemSales}\n\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a: \u0e22\u0e2d\u0e14\u0e08\u0e31\u0e14 ${sample.financeAmount}, \u0e2a\u0e31\u0e0d\u0e0d\u0e32 ${sample.contractCount}`,
  owner: () =>
    `${sampleNotice}\nOwner summary - ${sample.branch} (${sample.period})\nTotal sales = system sales + outside-system sales = ${sample.totalSales} baht.\nSupporting metrics: finance amount ${sample.financeAmount} baht, contract count ${sample.contractCount}.`,
};

function renderSummary() {
  const format = document.querySelector("#summaryFormat").value;
  document.querySelector("#summaryText").value = templates[format]();
}

document.querySelector("#summaryFormat").addEventListener("change", renderSummary);
document.querySelector("#copySummary").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.querySelector("#summaryText").value);
});
renderSummary();
