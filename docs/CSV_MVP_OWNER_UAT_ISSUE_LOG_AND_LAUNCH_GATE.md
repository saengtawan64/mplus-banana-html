# Controlled CSV MVP Owner UAT Issue Log and Launch Gate

Status: ready for Owner UAT / controlled store trial

Latest baseline commit: `4f5a2c6 docs: align csv policy with daily table gate`

Scope: store-side UAT logging, issue triage, and controlled launch decision

Production status: not full production

## Purpose

This document is for recording store-side UAT observations, triaging issues, and deciding whether the controlled CSV MVP can be used for daily review.

It does not approve code changes, parser changes, CSV URL changes, dashboard behavior changes, backend work, Auth/Firebase/API work, AI/chat/stock/OCR/loan calculator work, PDF/Excel/file export, or deployment.

## Current Verified State

- App Shell v2 is complete.
- Contextual CSV parser readiness guard passes `52/52`.
- Dashboard daily table can be CSV-backed only when `Parser: ok`.
- Live CSV preview was verified with `372` rows.
- Fetch failure restores the sample daily table.
- Dashboard hero/cards/charts remain sample/prototype.
- CSV `ยอดรวม` remains cross-check only, not official total.
- Official total remains `systemSales + outsideSystemSales`.
- Mapping wording shows `52/52`.
- CSV policy docs are aligned with the daily-table-only gate.

## Launch Gate Summary

Choose one gate decision after Owner UAT.

| Decision | Meaning | Required action |
|---|---|---|
| READY for controlled use | Owner accepts the current daily-table-only CSV boundary and no blocker is open. | Use for controlled daily review with issue logging. |
| READY with minor notes | No P0/P1 issue is open, but small wording, visual, or workflow notes remain. | Use with caution and schedule follow-up polish. |
| HOLD before use | A blocker or must-fix issue exists, or staff cannot clearly distinguish CSV-backed vs sample/prototype areas. | Do not use for store review until fixed and re-verified. |

## Pre-UAT Checklist

- [ ] Open `/dashboard.html`.
- [ ] Confirm the Dashboard loads.
- [ ] Confirm App Shell v2 is active.
- [ ] Confirm `Parser: ok`.
- [ ] Confirm `Draft rows` count.
- [ ] Confirm the daily table source note says CSV checked.
- [ ] Confirm the daily table row count.
- [ ] Confirm hero/cards/charts remain sample/prototype.
- [ ] Confirm Mapping says `52/52`.
- [ ] Confirm no blocking console errors if checked.
- [ ] Confirm mobile view if staff will use a phone.

## Issue Log

Use this table during Owner UAT. Add one row per observation.

| Date/time | Reporter | Page/route | Device | Parser status | Draft rows | Daily rows | Issue type | Severity | Description | Screenshot/link note | Expected behavior | Actual behavior | Decision | Owner/GPT/JPT action | Status |
|---|---|---|---|---|---:|---:|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Issue type examples:

- CSV fetch
- Parser status
- Row count
- Missing vs zero
- Dash handling
- CSV total cross-check
- Daily table display
- Mobile layout
- Mapping wording
- Staff misunderstanding
- Other

Severity levels:

- P0 Blocker
- P1 Must fix before use
- P2 Fix soon
- P3 Nice to have

## Decision Rules

### P0 Blocker

Hold before use if any P0 issue appears.

Examples:

- Dashboard does not load.
- Parser cannot run.
- Daily table becomes blank.
- Fetch failure does not restore the sample table.
- Missing or dash values become zero.
- CSV `ยอดรวม` is treated as the official total.

### P1 Must Fix Before Use

Hold or delay controlled use until reviewed.

Examples:

- Row count is clearly wrong.
- Source note is misleading.
- Staff cannot tell sample/prototype areas from CSV-backed daily table.
- Mobile table is unusable for the intended staff workflow.

### P2 Fix Soon

Allowed only if Owner accepts the note and no P0/P1 issue is open.

Examples:

- Wording polish.
- Minor spacing issue.
- Non-blocking visual issue.
- UAT note that needs a clearer explanation.

### P3 Nice To Have

Track for later polish.

Examples:

- Cosmetic alignment.
- Additional helper text.
- Future dashboard convenience idea.

## Store-Side Daily Use Rules

- ใช้ CSV เฉพาะตารางรายวันเมื่อ `Parser: ok`
- ห้ามใช้การ์ด/กราฟเป็นยอดจริงจาก CSV
- ถ้าโหลดไม่ผ่านให้ถือว่าเป็น sample/fallback
- ถ้าเจอจำนวนแถวผิดปกติให้จด issue ก่อน ไม่แก้เอง
- ห้ามเปลี่ยน URL หรือโครง CSV เองโดยไม่อนุมัติ

## Escalation Rules

Escalate to Owner/GPT/JPT when:

- Parser status is not `ok`.
- Warnings or errors appear.
- Draft rows count changes unexpectedly.
- Daily row count looks wrong.
- Missing or dash values look wrong.
- Staff are confused about the official total.
- Staff are confused about CSV-backed vs sample/prototype areas.
- Any page has blocking console errors.
- Any page has page-wide overflow.

Do not patch code, change URLs, edit parser behavior, or deploy from store-side observations without review approval.

## Launch Decision Checklist

Complete this before choosing the launch gate decision.

- [ ] Owner reviewed Dashboard.
- [ ] Owner reviewed Mapping.
- [ ] Owner understands the CSV daily-table-only boundary.
- [ ] Owner accepts that hero/cards/charts are sample/prototype.
- [ ] Owner accepts that no backend/Auth/database exists.
- [ ] Owner accepts that no PDF/Excel/file export exists.
- [ ] Owner accepts this is controlled MVP, not full production.
- [ ] Owner understands CSV `ยอดรวม` is cross-check only.
- [ ] Owner understands official total is `systemSales + outsideSystemSales`.
- [ ] Owner understands missing / dash / `—` is not zero.

Final launch gate decision:

- [ ] READY for controlled use
- [ ] READY with minor notes
- [ ] HOLD before use

Decision note:

```text

```

## Store Staff Explanation

Use this short explanation when introducing the controlled CSV MVP to store staff.

```text
ตอนนี้หน้า Dashboard ใช้ CSV ได้เฉพาะ “ตารางรายวัน” เท่านั้น เมื่อสถานะขึ้นว่า Parser: ok และแหล่งข้อมูลขึ้นว่า CSV ตรวจสอบแล้ว

การ์ดใหญ่ กราฟ และสรุปด้านบนยังเป็นข้อมูลตัวอย่าง/ต้นแบบ ห้ามใช้เป็นยอดขายทางการจาก CSV

ยอดขายรวมทางการคิดจาก ยอดในระบบ + ยอดนอกระบบ เท่านั้น ส่วนยอดรวมจาก CSV ใช้ตรวจสอบความถูกต้อง ไม่ใช่ยอดทางการ

ถ้า CSV โหลดไม่ได้ หรือ parser ไม่ผ่าน ให้ถือว่าตารางกลับไปเป็นข้อมูลตัวอย่าง และแจ้งเจ้าของ/ผู้ดูแลก่อนใช้งานต่อ
```

## Business Rule Checklist

These rules remain required during Owner UAT.

- `totalSales = systemSales + outsideSystemSales`
- CSV `ยอดรวม` is cross-check/validation only, not official total.
- Missing data is not zero.
- Dash / `-` / `—` is not zero.
- Real `0` is valid only for an active real row/value.
- Finance / contract / profit are supporting metrics only.
- Finance / contract / profit are not included in main sales total.
- Summary / `รวม` rows must not become daily sales rows.
- Blank rows must not become daily sales rows.
- Staff Targets are branch-level only.
- Staff Targets are not personal staff sales.
- Staff Targets are not commission calculation.

## No-Go Reminders

- Do not change the live CSV URL.
- Do not add AI/chat/stock/calculator now.
- Do not add backend/Auth/Firebase now.
- Do not change parser/dashboard behavior without GPT/JPT review.
- Do not treat CSV `ยอดรวม` as the official total.
- Do not treat sample hero/cards/charts as official CSV data.
- Do not manually edit generated data in the browser.
- Do not convert missing / dash / `—` values to zero.
- Do not export PDF/Excel as if production-ready.
- Do not add file download behavior.
- Do not deploy from UAT observations without approval.

## Known Limitations

- CSV use is controlled and limited to the Dashboard daily table.
- Dashboard hero/cards/charts remain sample/prototype.
- There is no backend.
- There is no Auth.
- There is no Firebase.
- There is no API.
- There is no database.
- There is no production data governance workflow.
- There is no PDF export.
- There is no Excel export.
- There is no file download/export behavior.
- Mapping is readiness-only.
- Export remains copy-only/sample summary.
- Owner/store staff must understand the mixed-state boundary before use.

## Recommended Next Step

Run Owner UAT using this issue log and launch gate checklist.

After UAT, choose the next phase explicitly:

1. Close controlled CSV MVP documentation if no P0/P1 issue is found.
2. Fix wording/status issues if UAT finds confusion.
3. Harden parser/dashboard diagnostics if UAT finds a real data safety issue.
4. Plan any broader CSV production integration as a separate approved phase.

Keep separate:

- live CSV URL changes,
- dashboard hero/card/chart replacement,
- daily table gate behavior changes,
- backend/Auth/Firebase/API,
- AI/chat/stock/OCR/loan calculator,
- PDF/Excel/file export.
