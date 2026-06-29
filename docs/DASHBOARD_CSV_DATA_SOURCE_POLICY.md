# Dashboard CSV Data Source Policy

## Current Status

- Live CSV preview panel is deployed and smoke tested.
- Controlled CSV MVP is active for Dashboard daily table only.
- When live fetch succeeds and parser status is `ok`, `#dailySalesRows` may be replaced through the approved daily-table gate.
- Dashboard hero/cards/charts remain sample/prototype and are not CSV-driven.
- Fetch/parser failure restores the sample daily table.
- CSV `ยอดรวม` remains diagnostic cross-check only, not official total.
- Latest parser readiness guard: `52/52` checks passed.
- Latest policy basis: `65dc7a3 docs: update mapping guard count`.

## Data Source States

### `sample`

The dashboard uses built-in sample/prototype data. This remains the default state when CSV is unavailable, parser output is blocked, or CSV-backed dashboard replacement has not been explicitly approved.

### `csvPreview`

The app can fetch CSV text and run the contextual parser. This state may render preview rows and status diagnostics. It must not replace hero/cards/charts. The daily table may become CSV-backed only through the separately approved `Parser: ok` daily-table gate.

### `csvDailyTableReady`

The CSV fetch succeeds, parser status is `ok`, required mappings are detected, and the approved daily-table gate activates. This state may replace only `#dailySalesRows` and update `#dailyTableDataSourceNote` to `แหล่งข้อมูล: CSV ตรวจสอบแล้ว`.

### `csvReady`

The CSV fetch succeeds, parser output is acceptable, required mappings are detected, QA gates pass, and Owner/GPT-JPT explicitly approves replacing a specific dashboard area beyond the current daily-table gate. This state enables controlled replacement only for the approved area.

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

## QA Gates Before New Replacement

Before any new dashboard area uses CSV-backed data beyond the approved daily table gate, confirm:

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

- No dashboard replacement beyond the approved daily-table gate.
- No hero/cards/charts replacement.
- No parser logic change.
- No deploy.
- No official dashboard summary numbers from CSV yet.
- Hero card should not be first replacement target.
- Sample/prototype warning must not disappear without approved replacement.
