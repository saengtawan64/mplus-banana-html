# CSV MVP Operating Checklist and Owner UAT Plan

Status: controlled CSV MVP readiness plan  
Latest baseline commit: `65dc7a3 docs: update mapping guard count`
Scope: Dashboard daily-table CSV preview operation and Owner UAT  
Production status: not production-ready

## Purpose

This document records how to operate and review the controlled CSV MVP safely over the next real-use readiness window.

The goal is to let the owner/store team use the Dashboard without misunderstanding which parts are CSV-backed and which parts remain sample/prototype.

This is an operating checklist and UAT guide only. It does not approve new behavior, new live CSV URLs, backend work, parser changes, or dashboard replacement beyond the currently verified daily-table gate.

## Current Controlled CSV MVP Status

Current verified state:

- App Shell v2 is complete and live verified.
- Contextual CSV parser local readiness guard passes `52/52` checks.
- Dashboard live CSV preview gate is verified.
- When parser status is `ok`, the Dashboard daily table can become CSV-backed.
- Latest live verification observed `372` preview rows and `372` daily table rows.
- Fetch failure restores the sample daily table.
- Latest fetch-failure verification observed `8` sample daily rows.
- Dashboard trust/readiness wording is visible.

## What Is Safe To Use Now

Safe controlled use:

- Open Dashboard and inspect the live CSV preview status.
- Use the daily table as CSV-backed only when status shows `Parser: ok`.
- Use `#dailyTableDataSourceNote` as the daily table source indicator.
- Use the live preview row count as an operational sanity check.
- Use Mapping as a readiness/explanation page only.
- Use the local parser readiness command as an engineering confidence check:

```powershell
node tests/contextual-csv-parser-readiness.mjs
```

Expected readiness output:

```text
Parser status: ok
Rows: 6
Checks: 52/52 passed
```

## What Is Not Production Yet

Not production-ready:

- Dashboard hero/cards/charts remain sample/prototype.
- Dashboard hero/cards/charts are not CSV-driven.
- No backend exists.
- No Auth exists.
- No Firebase exists.
- No API exists.
- No database exists.
- No real CSV governance workflow exists.
- No PDF export exists.
- No Excel export exists.
- No file download/export behavior exists.
- No AI/chat/stock/OCR/loan calculator is part of this MVP.
- CSV `ยอดรวม` is not the official total.

## What Is CSV-Backed

CSV-backed area:

- Dashboard daily table only.
- Only when live preview status shows `Parser: ok`.
- Only through the existing approved daily-table gate.

The live preview shows:

- fetch status,
- parser status,
- draft row count,
- warning count,
- error count,
- latest check time.

## What Remains Sample / Prototype

These Dashboard areas remain sample/prototype:

- hero KPI panel,
- total sales card,
- system/outside sales cards,
- supporting metric cards,
- focus progress,
- recent sales bars,
- monthly chart/fallback.

Do not use those areas as official CSV-driven totals during the MVP.

## Daily Opening Checklist

Use this at the start of each store-use day.

- [ ] Open `/dashboard.html`.
- [ ] Confirm the page loads normally.
- [ ] Confirm App Shell v2 navigation is visible.
- [ ] Confirm the Dashboard active navigation state is correct.
- [ ] Confirm the live CSV preview panel is visible.
- [ ] Confirm the status includes `Fetch: success`.
- [ ] Confirm the status includes `Parser: ok`.
- [ ] Record the `Draft rows` count.
- [ ] Confirm `#dailyTableDataSourceNote` says `แหล่งข้อมูล: CSV ตรวจสอบแล้ว`.
- [ ] Confirm the daily table row count looks reasonable for the selected source/month.
- [ ] Confirm Dashboard trust/readiness wording is visible.
- [ ] Confirm hero/cards/charts are not treated as official CSV totals.
- [ ] Confirm CSV `ยอดรวม` is used only as a cross-check.
- [ ] If fetch/parser fails, treat the daily table as sample/fallback and stop CSV use until reviewed.

## Live Preview Checklist

Pass criteria:

- [ ] `#liveCsvPreviewPanel` is visible.
- [ ] `#liveCsvPreviewStatus` is visible.
- [ ] Status says `Fetch: success`.
- [ ] Status says `Parser: ok`.
- [ ] Status includes `Draft rows`.
- [ ] Status includes `Warnings`.
- [ ] Status includes `Errors`.
- [ ] Status includes the current boundary wording:

```text
Dashboard hero/cards/charts ยังใช้ข้อมูลตัวอย่าง
CSV preview ไม่แทน hero/cards/charts
ตารางรายวันใช้ CSV เฉพาะเมื่อ Parser: ok
ถ้าโหลดหรือ parse ไม่ผ่านจะกลับไปใช้ข้อมูลตัวอย่าง
```

Fail criteria:

- [ ] Fetch failed.
- [ ] Parser status is not `ok`.
- [ ] Draft row count is unexpected.
- [ ] Warning/error count needs owner review.
- [ ] Daily table source note does not match the intended state.

## Dashboard Reading Guide

Read the Dashboard in two layers.

Layer 1: CSV-backed daily table, only when `Parser: ok`

- Use the daily table for CSV daily row review.
- Confirm source note says `แหล่งข้อมูล: CSV ตรวจสอบแล้ว`.
- Confirm row count is plausible.
- Treat missing values and dash values as missing, not zero.

Layer 2: sample/prototype dashboard summary

- Hero/cards/charts remain sample/prototype.
- Do not use hero/cards/charts as official CSV totals.
- Do not compare daily table totals against sample cards as if both are real.
- Do not present sample chart values as production performance.

## Fallback / Failure Checklist

If CSV fetch fails, parser fails, or parser status is not `ok`:

- [ ] Confirm the preview status shows the failure or non-ok parser state.
- [ ] Confirm the daily table source note returns to sample/fallback wording.
- [ ] Confirm sample daily rows are restored.
- [ ] Do not use the daily table as CSV-backed.
- [ ] Do not use hero/cards/charts as official CSV totals.
- [ ] Capture the visible status text.
- [ ] Capture row count if possible.
- [ ] Report to owner/GPT/JPT before making changes.

Known safe fallback behavior:

- Fetch failure restores sample daily table.
- Latest verified fallback row count: `8`.
- Dashboard does not crash when CSV fetch is blocked.
- Dashboard must never become blank because CSV failed.

## Owner UAT Checklist

Use this checklist with Pass / Fail / Notes.

| Area | Check | Pass/Fail | Notes |
|---|---|---|---|
| Desktop Dashboard | Page loads HTTP 200 after redirect/normalization if any |  |  |
| Desktop Dashboard | App Shell v2 active |  |  |
| Desktop Dashboard | Live CSV preview panel visible |  |  |
| Desktop Dashboard | `Parser: ok` visible when CSV is usable |  |  |
| Desktop Dashboard | Draft row count visible |  |  |
| Desktop Dashboard | Daily table source note visible |  |  |
| Desktop Dashboard | Daily table row count reasonable |  |  |
| Desktop Dashboard | Hero/cards/charts still marked sample/prototype |  |  |
| Mobile Dashboard | Mobile top bar visible at 390x844 |  |  |
| Mobile Dashboard | Hamburger overlay opens and closes |  |  |
| Mobile Dashboard | Existing bottom nav visible |  |  |
| Mobile Dashboard | Daily table is contained or scrolls inside panel |  |  |
| Fallback | Blocking/failing CSV restores sample daily table |  |  |
| Mapping | Mapping page says readiness-only |  |  |
| Mapping | No production CSV import claim |  |  |
| App Shell | Navigation works across primary pages |  |  |
| Console/Layout | No blocking console errors if checked |  |  |
| Console/Layout | No page-wide horizontal overflow |  |  |
| Business Formula | Official total formula is understood |  |  |
| Cross-Check | CSV `ยอดรวม` is understood as cross-check only |  |  |

## Business Rule Checklist

These rules must remain true:

- `totalSales = systemSales + outsideSystemSales`
- CSV `ยอดรวม` is diagnostic cross-check only, not official total.
- Missing data is not zero.
- Dash / `-` / `—` is not zero.
- Real `0` is valid only for active real rows/values.
- Finance / contract / profit are supporting metrics only.
- Finance / contract / profit are not included in main sales total.
- Summary / `รวม` rows must not become daily sales rows.
- Blank rows must not become daily sales rows.
- Staff Targets are branch-level only.
- Staff Targets are not personal staff sales.
- Staff Targets are not commission calculation.

## Store Staff Explanation

```text
ตอนนี้หน้า Dashboard ใช้ CSV ได้เฉพาะ “ตารางรายวัน” เท่านั้น เมื่อสถานะขึ้นว่า Parser: ok และแหล่งข้อมูลขึ้นว่า CSV ตรวจสอบแล้ว

การ์ดใหญ่ กราฟ และสรุปด้านบนยังเป็นข้อมูลตัวอย่าง/ต้นแบบ ห้ามใช้เป็นยอดขายทางการจาก CSV

ยอดขายรวมทางการคิดจาก ยอดในระบบ + ยอดนอกระบบ เท่านั้น ส่วนยอดรวมจาก CSV ใช้ตรวจสอบความถูกต้อง ไม่ใช่ยอดทางการ

ถ้า CSV โหลดไม่ได้ หรือ parser ไม่ผ่าน ให้ถือว่าตารางกลับไปเป็นข้อมูลตัวอย่าง และแจ้งเจ้าของ/ผู้ดูแลก่อนใช้งานต่อ
```

## No-Go Items

Do not do these during the controlled CSV MVP:

- Do not add or change the live CSV URL without approval.
- Do not treat sample hero/cards/charts as official CSV data.
- Do not manually edit generated data in the browser.
- Do not treat CSV `ยอดรวม` as official total.
- Do not convert missing / dash / `—` values to zero.
- Do not add AI/chat/stock/OCR/loan calculator.
- Do not add backend/Auth/Firebase/API/database.
- Do not export PDF/Excel/file output as if production-ready.
- Do not change parser behavior without GPT/JPT review.
- Do not change CSV fetch behavior without GPT/JPT review.
- Do not change the daily table gate without GPT/JPT review.
- Do not make dashboard hero/cards/charts CSV-driven without separate approval.

## Known Limitations

- CSV use is controlled and limited to the Dashboard daily table.
- Current live CSV URL already exists and must not be changed without approval.
- There is no authentication or access control.
- There is no backend audit trail.
- There is no database.
- There is no production data governance.
- Hero/cards/charts remain sample/prototype.
- Mapping is readiness-only.
- Export remains copy-only/sample summary.
- Owner/store staff must understand the mixed-state boundary before use.

## Escalation Rules

Escalate to owner/GPT/JPT when:

- Fetch status is failed.
- Parser status is not `ok`.
- Draft row count changes unexpectedly.
- Daily row count looks too high, too low, or stale.
- Warning/error count is not zero.
- CSV `ยอดรวม` mismatch needs review.
- Missing values appear where real numbers are expected.
- Dash / `—` appears in required sales fields.
- Store team is unsure whether the table is CSV-backed or sample-backed.
- Any page shows blocking console errors or page-wide overflow.

Do not patch code, change URLs, or deploy from store-side observations without review approval.

## Recommended Next Phase

Recommended next step: documentation-only closure of this operating checklist, then Owner UAT.

After Owner UAT, choose one next phase explicitly:

1. Update stale CSV policy docs to match the current daily-table-only gate.
2. Add a tiny non-behavior Dashboard operating note if Owner wants more visible guidance.
3. Harden parser/dashboard diagnostics only if UAT finds a real issue.
4. Plan broader CSV production integration separately.

Keep separate:

- live CSV URL changes,
- dashboard hero/card/chart replacement,
- daily table gate behavior changes,
- backend/Auth/Firebase/API,
- AI/chat/stock/OCR/loan calculator,
- PDF/Excel/file export.
