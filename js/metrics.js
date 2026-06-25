export function toNumber(value) {
  if (value === null || value === undefined || value === "") return { status: "missing", value: null };
  const cleaned = String(value).replace(/,/g, "").trim();
  const number = Number(cleaned);
  if (Number.isNaN(number)) return { status: "missing", value: null };
  return { status: "ok", value: number };
}

export function calculateSales(row) {
  if (!row) return { status: "missing", totalSales: null };

  const systemSales = toNumber(row.systemSales);
  const outsideSystemSales = toNumber(row.outsideSystemSales);
  const deviceCount = toNumber(row.deviceCount);
  const financeAmount = toNumber(row.financeAmount);
  const contractCount = toNumber(row.contractCount);
  const profit = toNumber(row.profit);

  if (systemSales.status !== "ok" || outsideSystemSales.status !== "ok") {
    return {
      status: "missing",
      totalSales: null,
      systemSales,
      outsideSystemSales,
      deviceCount,
      financeAmount,
      contractCount,
      profit,
    };
  }

  return {
    status: "ok",
    totalSales: systemSales.value + outsideSystemSales.value,
    systemSales,
    outsideSystemSales,
    deviceCount,
    financeAmount,
    contractCount,
    profit,
  };
}

export function targetStatus(actual, target) {
  if (actual === null || actual === undefined || !target) return "gray";
  const ratio = actual / target;
  if (ratio >= 1) return "green";
  if (ratio >= 0.7) return "yellow";
  return "red";
}

export function formatMoney(value) {
  if (value === null || value === undefined) return "ไม่มีข้อมูล";
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
}
