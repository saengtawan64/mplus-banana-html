import { ROLE_KEYS, normalizeRoleKey } from "./roles.js";

const STORAGE_KEY = "mplusQuickSession";

// Prototype-only local preference storage.
// This is not real authentication, security, or production permission enforcement.
// It only remembers the selected role and branch for static HTML review flows.
const defaultSession = {
  roleKey: ROLE_KEYS.OWNER,
  branchId: "lansak",
};

export function getSession() {
  try {
    return { ...defaultSession, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...defaultSession };
  }
}

export function setSession(nextSession) {
  const session = {
    ...getSession(),
    ...nextSession,
    roleKey: normalizeRoleKey(nextSession.roleKey || getSession().roleKey),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}
