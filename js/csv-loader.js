export function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  row.push(current);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);

  const headers = rows.shift() || [];
  return rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header.trim(), cells[index] ?? ""])));
}

export async function loadPublishedCsv(url) {
  if (!url) {
    return { status: "missing", rows: [], message: "ยังไม่ได้ตั้งค่าลิงก์ CSV สำหรับสาขา/ปีนี้" };
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return { status: "error", rows: [], message: `เรียก CSV ไม่สำเร็จ สถานะ ${response.status}` };
    }
    const text = await response.text();
    return { status: "ok", rows: parseCsv(text), message: "โหลด CSV แล้ว" };
  } catch (error) {
    return { status: "error", rows: [], message: error.message };
  }
}
