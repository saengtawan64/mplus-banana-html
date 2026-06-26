# Dashboard CSV Data Source Policy

## Current Status

- Live CSV preview panel is deployed and smoke tested.
- CSV output is still preview/debug only.
- Dashboard sample data has not been replaced.
- Latest policy basis: `9ff6aaf docs: record live csv preview smoke check`.

## Data Source States

### `sample`

The dashboard uses built-in sample/prototype data. This remains the default state when CSV is unavailable, parser output is blocked, or CSV-backed dashboard replacement has not been explicitly approved.

### `csvPreview`

The app can fetch CSV text and run the contextual parser, but the result is shown only as preview/debug information. This state must not replace dashboard cards, charts, or tables.

### `csvReady`

The CSV fetch succeeds, parser output is acceptable, required mappings are detected, QA gates pass, and Owner/GPT-JPT explicitly approves replacing a specific dashboard area. This state enables controlled replacement only for the approved area.

### `csvBlocked`

The CSV fetch succeeds, but parser status or mapping structure blocks safe dashboard use. The dashboard must keep sample data and show a clear preview/debug warning.

### `csvError`

The CSV fetch fails, CORS/network blocks the request, the response is empty, or another fetch-level error occurs. The dashboard must keep sample data and show a safe fallback message.

## Parser Status Policy

- `OK`: eligible for controlled replacement only after QA gate and explicit approval.
- `WARNING`: preview/debug only by default; may be used only for limited preview table if explicitly approved.
- `STOP`: never replace dashboard; fallback to sample only.

## Replacement Phases

- Phase A: data-source policy doc.
- Phase B: CSV-backed preview table.
- Phase C: replace daily table only.
- Phase D: replace recent bars / monthly chart.
- Phase E: replace hero/system/outside cards.
- Phase F: validate against CSV `ยอดรวม` as warning only.

## Missing vs Zero Policy

- Missing values display as `-` or “ไม่มีข้อมูล”.
- Real `0` displays as `0`.
- Missing must never be converted to `0`.
- Future placeholder zero rows are not real zero sales until separately approved.

## Official Total Policy

```text
totalSales = systemSales + outsideSystemSales
```

- CSV `ยอดรวม` is cross-check/validation only.
- CSV `ยอดรวม` must never be official total.
- Finance / contract / profit are supporting only and must not be included in official sales total.

## UI Wording Policy

Approved wording options:

- `ข้อมูลตัวอย่างเท่านั้น ยังไม่ใช่ยอดขายจริงจาก CSV`
- `ข้อมูล CSV ยังอยู่ในโหมด Preview`
- `Dashboard ตัวอย่างยังไม่ถูกแทน`
- `ข้อมูลจาก CSV แบบตรวจสอบแล้ว`
- `บางแถวมีข้อมูลไม่ครบ`
- `ข้อมูลที่หายจะแสดงเป็นไม่มีข้อมูล ไม่ใช่ 0`
- `อ่าน CSV ได้ แต่โครงสร้างยังไม่พร้อมใช้งาน`
- `ไม่สามารถโหลด CSV ได้ กำลังแสดง Dashboard ตัวอย่างเหมือนเดิม`
- `แหล่งข้อมูล: CSV Preview เท่านั้น`
- `แหล่งข้อมูล: CSV ตรวจสอบแล้ว`

## Fallback Policy

- Fetch fail -> keep sample dashboard.
- Parser `STOP` -> keep sample dashboard.
- Missing critical mapping -> keep sample dashboard.
- Dashboard must never become blank because CSV failed.

## QA Gates Before Replacement

Before any dashboard area uses CSV-backed data, confirm:

- Live CSV fetch success.
- Parser status acceptable.
- Required mappings detected.
- Row count expected.
- Missing/zero verified.
- Future placeholder zero policy approved separately.
- CSV `ยอดรวม` not used as official total.
- Formula verified.
- Finance/contract/profit supporting only.
- Desktop smoke.
- Mobile smoke.
- No blocking console errors.
- Sample/prototype warning replacement wording approved.
- Fallback verified.

## Risk and Guardrails

- No dashboard replacement in this policy step.
- No parser logic change.
- No deploy.
- No official dashboard numbers from CSV yet.
- Hero card should not be first replacement target.
- Sample/prototype warning must not disappear without approved replacement.
