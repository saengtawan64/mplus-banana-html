export const branches = [
  { id: "lansak", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e25\u0e32\u0e19\u0e2a\u0e31\u0e01", active: true, csvByYear: {} },
  { id: "dan-chang", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e14\u0e48\u0e32\u0e19\u0e0a\u0e49\u0e32\u0e07", active: true, csvByYear: {} },
  { id: "ban-rai", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e1a\u0e49\u0e32\u0e19\u0e44\u0e23\u0e48", active: true, csvByYear: {} },
  { id: "sena", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e40\u0e2a\u0e19\u0e32", active: true, csvByYear: {} },
  { id: "talat-dan-chang", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e15\u0e25\u0e32\u0e14\u0e14\u0e48\u0e32\u0e19\u0e0a\u0e49\u0e32\u0e07", active: true, csvByYear: {} },
  { id: "han-kha", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e2b\u0e31\u0e19\u0e04\u0e32", active: true, csvByYear: {} },
  { id: "don-chedi", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e14\u0e2d\u0e19\u0e40\u0e08\u0e14\u0e35\u0e22\u0e4c", active: true, csvByYear: {} },
  { id: "sing-buri", name: "\u0e1a\u0e32\u0e19\u0e32\u0e19\u0e48\u0e32\u0e2a\u0e34\u0e07\u0e1a\u0e38\u0e23\u0e35", active: true, csvByYear: {} },
  { id: "doem-bang-nang-buat", name: "\u0e40\u0e14\u0e34\u0e21\u0e1a\u0e32\u0e07\u0e19\u0e32\u0e07\u0e1a\u0e27\u0e0a", active: true, csvByYear: {} },
];

export const canonicalFields = Object.freeze({
  date: "Date",
  systemSales: "System sales",
  outsideSystemSales: "Outside-system sales",
  deviceCount: "Device count",
  financeAmount: "Finance amount",
  contractCount: "Contract count",
  profit: "Profit",
});

export const headerAliases = {
  date: ["date", "day", "\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48"],
  systemSales: ["system sales", "\u0e22\u0e2d\u0e14\u0e43\u0e19\u0e23\u0e30\u0e1a\u0e1a", "in system"],
  outsideSystemSales: ["outside sales", "outside-system sales", "\u0e22\u0e2d\u0e14\u0e19\u0e2d\u0e01\u0e23\u0e30\u0e1a\u0e1a", "outside system"],
  deviceCount: ["device count", "\u0e08\u0e33\u0e19\u0e27\u0e19\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07", "\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07"],
  financeAmount: ["finance", "finance amount", "\u0e22\u0e2d\u0e14\u0e08\u0e31\u0e14", "\u0e08\u0e31\u0e14"],
  contractCount: ["contract", "contracts", "\u0e08\u0e33\u0e19\u0e27\u0e19\u0e2a\u0e31\u0e0d\u0e0d\u0e32", "\u0e2a\u0e31\u0e0d\u0e0d\u0e32"],
  profit: ["profit", "\u0e01\u0e33\u0e44\u0e23"],
};

export const brandAliases = {
  Samsung: ["samsung", "ss", "\u0e0b\u0e31\u0e21\u0e0b\u0e38\u0e07"],
  OPPO: ["oppo"],
  vivo: ["vivo", "\u0e27\u0e35\u0e42\u0e27\u0e48"],
  Apple: ["apple", "iphone", "\u0e44\u0e2d\u0e42\u0e1f\u0e19"],
};

export const focusTargets = [
  {
    branchId: "lansak",
    month: new Date().toISOString().slice(0, 7),
    brands: ["Samsung", "OPPO", "vivo"],
    targetSales: 500000,
    targetDevices: 60,
  },
];
