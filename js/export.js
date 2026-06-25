import "./app.js";

const sample = {
  branch: "สาขาตัวอย่าง",
  period: new Date().toISOString().slice(0, 7),
  totalSales: "152,000",
  systemSales: "120,000",
  outsideSystemSales: "32,000",
  financeAmount: "45,000",
  contractCount: "3",
};

const sampleNotice = "ข้อมูลตัวอย่างเท่านั้น ยังไม่ใช่ยอดขายจริงจาก CSV";

const templates = {
  short: () => `${sampleNotice}\n${sample.branch} ${sample.period}: ยอดขายรวม ${sample.totalSales} บาท`,
  formal: () =>
    `${sampleNotice}\nรายงานยอดขายของ ${sample.branch} ประจำงวด ${sample.period}\nยอดขายรวม ${sample.totalSales} บาท มาจากยอดในระบบ ${sample.systemSales} บาท และยอดนอกระบบ ${sample.outsideSystemSales} บาท\nยอดจัดและจำนวนสัญญาเป็นข้อมูลประกอบเท่านั้น ไม่รวมในยอดขายรวม`,
  line: () =>
    `${sampleNotice}\n${sample.branch}\nยอดขายรวม: ${sample.totalSales}\nในระบบ: ${sample.systemSales}\nนอกระบบ: ${sample.outsideSystemSales}\nข้อมูลประกอบ: ยอดจัด ${sample.financeAmount}, สัญญา ${sample.contractCount}`,
  owner: () =>
    `${sampleNotice}\nสรุปสำหรับเจ้าของร้าน - ${sample.branch} (${sample.period})\nยอดขายรวม = ยอดในระบบ + ยอดนอกระบบ = ${sample.totalSales} บาท\nข้อมูลประกอบ: ยอดจัด ${sample.financeAmount} บาท, จำนวนสัญญา ${sample.contractCount}`,
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
