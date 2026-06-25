export const ROLE_KEYS = Object.freeze({
  CREATOR: "CREATOR",
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  VIEWER: "VIEWER",
});

export const ROLE_LABELS = Object.freeze({
  [ROLE_KEYS.CREATOR]: "คุณตะวัน (Creator)",
  [ROLE_KEYS.OWNER]: "เจ้าของร้าน (Owner)",
  [ROLE_KEYS.ADMIN]: "ผู้จัดการ (Admin)",
  [ROLE_KEYS.STAFF]: "พนักงาน (Staff)",
  [ROLE_KEYS.VIEWER]: "ผู้ดูอย่างเดียว (Viewer)",
});

const DISPLAY_TO_ROLE = new Map([
  ["creator", ROLE_KEYS.CREATOR],
  ["super admin", ROLE_KEYS.CREATOR],
  ["\u0e04\u0e38\u0e13\u0e15\u0e30\u0e27\u0e31\u0e19", ROLE_KEYS.CREATOR],
  ["owner", ROLE_KEYS.OWNER],
  ["\u0e40\u0e08\u0e49\u0e32\u0e02\u0e2d\u0e07\u0e23\u0e49\u0e32\u0e19", ROLE_KEYS.OWNER],
  ["admin", ROLE_KEYS.ADMIN],
  ["manager", ROLE_KEYS.ADMIN],
  ["\u0e1c\u0e39\u0e49\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23", ROLE_KEYS.ADMIN],
  ["staff", ROLE_KEYS.STAFF],
  ["\u0e1e\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19", ROLE_KEYS.STAFF],
  ["viewer", ROLE_KEYS.VIEWER],
]);

export function normalizeRoleKey(input) {
  const raw = String(input || "").trim();
  if (Object.prototype.hasOwnProperty.call(ROLE_KEYS, raw)) return raw;
  return DISPLAY_TO_ROLE.get(raw.toLowerCase()) || ROLE_KEYS.VIEWER;
}

export function canViewAllBranches(roleKey) {
  return [ROLE_KEYS.CREATOR, ROLE_KEYS.OWNER, ROLE_KEYS.ADMIN].includes(normalizeRoleKey(roleKey));
}

export function roleOptions() {
  return Object.values(ROLE_KEYS).map((key) => ({ key, label: ROLE_LABELS[key] }));
}
