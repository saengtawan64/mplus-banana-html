# Controlled CSV MVP Ready Status and Day 1 Store Trial Runbook

Status: READY for controlled use

Latest baseline commit: `eb202a7 docs: add csv mvp owner uat launch gate`

Scope: Dashboard daily-table-only CSV MVP

Production status: controlled MVP, not full production

## Readiness Decision Summary

Owner UAT Launch Gate result: READY for controlled use.

No P0/P1 issues were found during the final Owner UAT launch gate.

Current verified state:

- App Shell v2 is complete.
- Local contextual CSV parser readiness guard passes `52/52`.
- Dashboard live check passed.
- CSV preview status showed `Fetch: success` and `Parser: ok`.
- Live preview row count: `372`.
- Daily table source note: `แหล่งข้อมูล: CSV ตรวจสอบแล้ว`.
- Daily table row count: `372`.
- Daily table state: CSV-backed, daily table only.
- Dashboard hero/cards/charts remain sample/prototype.
- Mapping readiness check passed.
- Mapping `52/52` wording is visible.
- Regression routes passed.
- No P0/P1 issues were found.

Known final UAT note:

- P3: fetch-failure simulation was not rerun in the final Owner UAT pass because the available browser tool did not expose a safe Google-CSV-only request block. Prior fallback verification exists and remains documented.

## Controlled Use Boundary

This controlled MVP allows the Dashboard daily table to use CSV rows only when the live preview reports `Parser: ok`.

The CSV-backed state applies only to the daily table. Dashboard hero/cards/charts remain sample/prototype and must not be used as official CSV-driven totals.

CSV `ยอดรวม` remains diagnostic cross-check only. The official total remains:

```text
totalSales = systemSales + outsideSystemSales
```

## What Is Allowed During Controlled Use

- View the Dashboard daily table from CSV when `Parser: ok`.
- Use the live preview row count as an operational sanity check.
- Use the daily table row count as an operational sanity check.
- Use the daily table source note to confirm whether the table is CSV-backed.
- Use Mapping as a readiness/explanation page.
- Record observations and issues in the UAT issue log.
- Use the store-side Thai explanation from the UAT docs when explaining the boundary to staff.

## What Is Not Allowed

- Do not treat Dashboard hero/cards/charts as official CSV totals.
- Do not treat CSV `ยอดรวม` as the official total.
- Do not change the live CSV URL.
- Do not change the CSV structure without approval.
- Do not change parser/dashboard behavior without GPT/JPT review.
- Do not manually patch generated browser data.
- Do not add AI/chat/stock/OCR/loan calculator now.
- Do not add backend/Auth/Firebase/API now.
- Do not export PDF/Excel/file output as production.

## Day 1 Opening Checklist

Run this checklist before using the Dashboard for store review.

- [ ] Open `/dashboard.html`.
- [ ] Confirm the Dashboard loads.
- [ ] Confirm App Shell v2 is active.
- [ ] Confirm `Fetch: success`.
- [ ] Confirm `Parser: ok`.
- [ ] Record `Draft rows`.
- [ ] Confirm the daily table source note says CSV checked.
- [ ] Record the daily table row count.
- [ ] Confirm the daily table is not blank.
- [ ] Confirm Dashboard hero/cards/charts remain sample/prototype.
- [ ] Open `/mapping.html`.
- [ ] Confirm Mapping loads.
- [ ] Confirm Mapping shows `52/52`.
- [ ] Confirm Mapping remains readiness-only.
- [ ] Confirm staff understand the CSV daily-table-only explanation.

Day 1 opening record:

| Item | Value |
|---|---|
| Date/time |  |
| Owner/staff reviewer |  |
| Fetch status |  |
| Parser status |  |
| Draft rows |  |
| Daily table rows |  |
| Daily source note |  |
| Mapping 52/52 visible |  |
| Staff explanation understood |  |
| Opening decision |  |

## During-Day Monitoring Checklist

Use this checklist during store use.

- [ ] Re-check row count if data seems stale.
- [ ] Watch for parser status changes.
- [ ] Watch warning/error counts.
- [ ] Confirm the daily table is not blank.
- [ ] Confirm the source note still matches the intended state.
- [ ] Do not manually patch browser data.
- [ ] Do not change CSV URL or CSV structure.
- [ ] Record an issue if something looks wrong.
- [ ] Escalate immediately for P0/P1 symptoms.

During-day monitoring record:

| Time | Parser status | Draft rows | Daily rows | Issue? | Action |
|---|---|---:|---:|---|---|
|  |  |  |  |  |  |

## Closing Checklist

Run this checklist at the end of Day 1.

- [ ] Record final parser status.
- [ ] Record final preview row count.
- [ ] Record final daily row count.
- [ ] Record whether warnings/errors appeared.
- [ ] Record any staff confusion.
- [ ] Record any issue severity from P0 to P3.
- [ ] Decide whether the next day remains controlled use or needs HOLD.

Day 1 closing record:

| Item | Value |
|---|---|
| Final parser status |  |
| Final preview rows |  |
| Final daily rows |  |
| Warnings/errors |  |
| Staff confusion |  |
| Highest issue severity |  |
| Next day decision |  |

## Issue Severity Response

| Severity | Meaning | Response |
|---|---|---|
| P0 Blocker | Unsafe or broken controlled use. | Stop using immediately and hold before further store review. |
| P1 Must fix before use | Major trust, source, row count, or usability issue. | Do not continue until reviewed. |
| P2 Fix soon | Non-blocking issue that may affect confidence or workflow. | Continue with caution and log follow-up. |
| P3 Nice to have | Minor wording, visual, or polish note. | Note for later polish. |

P0 examples:

- Dashboard does not load.
- Parser cannot run.
- Daily table becomes blank.
- Fetch failure does not restore sample/fallback behavior.
- Missing or dash values become zero.
- CSV `ยอดรวม` is treated as the official total.

P1 examples:

- Row count is clearly wrong.
- Source note is misleading.
- Staff cannot distinguish CSV-backed daily table from sample/prototype cards/charts.
- Mobile table is unusable for the intended workflow.

## Store Staff Reminder

```text
ตอนนี้หน้า Dashboard ใช้ CSV ได้เฉพาะ “ตารางรายวัน” เท่านั้น เมื่อสถานะขึ้นว่า Parser: ok และแหล่งข้อมูลขึ้นว่า CSV ตรวจสอบแล้ว

การ์ดใหญ่ กราฟ และสรุปด้านบนยังเป็นข้อมูลตัวอย่าง/ต้นแบบ ห้ามใช้เป็นยอดขายทางการจาก CSV

ยอดขายรวมทางการคิดจาก ยอดในระบบ + ยอดนอกระบบ เท่านั้น ส่วนยอดรวมจาก CSV ใช้ตรวจสอบความถูกต้อง ไม่ใช่ยอดทางการ

ถ้า CSV โหลดไม่ได้ หรือ parser ไม่ผ่าน ให้ถือว่าตารางกลับไปเป็นข้อมูลตัวอย่าง และแจ้งเจ้าของ/ผู้ดูแลก่อนใช้งานต่อ
```

## Known Limitations

- This is not full production.
- CSV use is controlled and limited to the Dashboard daily table.
- Dashboard hero/cards/charts are not official CSV-driven outputs.
- There is no backend.
- There is no Auth.
- There is no Firebase.
- There is no API.
- There is no database.
- There is no production CSV governance workflow.
- There is no PDF export.
- There is no Excel export.
- There is no file download/export behavior.
- Mapping is readiness-only.
- Export remains copy-only/sample summary.

## Business Rules That Must Remain True

- `totalSales = systemSales + outsideSystemSales`
- CSV `ยอดรวม` is cross-check/validation only, not official total.
- Missing data is not zero.
- Dash / `-` / `—` is not zero.
- Real `0` is valid only for an active real row/value.
- Finance / contract / profit are supporting metrics only.
- Finance / contract / profit are not included in main sales total.
- Staff Targets are branch-level only.
- Staff Targets are not personal staff sales.
- Staff Targets are not commission calculation.

## Next Recommended Phase

Recommended immediate next phase: Day 1 controlled store trial.

During Day 1:

- Collect issue log entries.
- Keep the CSV boundary daily-table-only.
- Do not make code changes from store-side observations without review.
- Do not change CSV URL or CSV structure without approval.

After Day 1:

- If no P0/P1 issues appear, create a controlled-use closure note.
- If P0/P1 appears, hold controlled use until reviewed.
- If only P2/P3 notes appear, decide whether to continue controlled use with follow-up polish.

Possible next approved phases:

- Dashboard daily-table polish.
- Parser diagnostic hardening.
- CSV governance/live URL policy.
- Broader CSV production integration.

Keep separate:

- live CSV URL changes,
- dashboard hero/card/chart replacement,
- daily table gate behavior changes,
- backend/Auth/Firebase/API,
- AI/chat/stock/OCR/loan calculator,
- PDF/Excel/file export.
