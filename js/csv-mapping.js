import { headerAliases, canonicalFields } from "./data-config.js";

function normalizeHeader(value) {
  return String(value || "").trim().toLowerCase();
}

export function detectMapping(headers) {
  const normalized = new Map(headers.map((header) => [normalizeHeader(header), header]));
  const fields = {};
  const missing = [];

  Object.keys(canonicalFields).forEach((field) => {
    const aliases = [field, canonicalFields[field], ...(headerAliases[field] || [])];
    const match = aliases.map(normalizeHeader).find((alias) => normalized.has(alias));
    if (match) fields[field] = normalized.get(match);
    else missing.push(field);
  });

  const mappedHeaders = new Set(Object.values(fields));
  const unmappedHeaders = headers.filter((header) => !mappedHeaders.has(header));

  return {
    complete: missing.length === 0,
    fields,
    missing,
    unmappedHeaders,
  };
}

export function mapRows(rows, mapping) {
  return rows.map((row) => {
    const mapped = {};
    Object.entries(mapping.fields).forEach(([field, header]) => {
      mapped[field] = row[header];
    });
    return mapped;
  });
}
