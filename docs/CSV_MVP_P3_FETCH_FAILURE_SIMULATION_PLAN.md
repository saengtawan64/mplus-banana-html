# Controlled CSV MVP P3 Fetch-Failure Simulation Plan

## Status

Status: proposed safe simulation plan

Latest baseline commit: `8a919b5 docs: add csv mvp stability summary`

Scope: fetch-failure verification only, no behavior change.

This document defines a safe plan for closing the remaining P3 fetch-failure simulation note without changing app behavior, parser behavior, CSV behavior, live CSV URL, or Dashboard replacement gates.

## Purpose

The goal is to safely verify the existing fallback behavior:

- When live CSV fetch fails, status should show failure.
- Daily table should restore or remain in sample fallback instead of becoming blank.
- Dashboard should not crash.
- Dashboard hero/cards/charts should remain sample/prototype.
- No parser behavior should be changed.
- No Dashboard behavior should be changed.
- No live CSV URL should be changed.

This plan is verification-only. It does not approve implementation changes.

## Current P3 Background

The remaining P3 exists because the latest Day 1 and Day 2 controlled-use snapshots did not rerun the fetch-failure simulation.

Prior fallback verification exists.

This P3 does not block controlled use.

P3 should be closed only with a safe targeted test or explicitly accepted by the owner.

Current stable state:

- Parser: `ok`.
- Preview rows: `372`.
- Daily table rows: `372`.
- Daily table source note: `แหล่งข้อมูล: CSV ตรวจสอบแล้ว`.
- Warnings: `0`.
- Errors: `0`.
- No P0/P1/P2 issues.

## Safe Simulation Options

### Option A: Browser DevTools Request Blocking

Preferred if tooling supports exact request blocking.

- Block only the Google CSV request.
- Do not block the whole site.
- Do not edit code.
- Do not change the live CSV URL.
- Do not modify deployed files.
- Verify fallback behavior.
- Confirm Dashboard remains usable.

### Option B: Temporary Browser/Network Profile

Use an isolated browser profile or network tool that can block only the CSV host or exact CSV request.

- Do not alter repo files.
- Do not alter deployed files.
- Do not alter browser settings outside the temporary test profile.
- Do not block all network traffic.
- Verify fallback behavior.
- Confirm Dashboard remains usable.

### Option C: Local-Only Manual Test Page Environment

Use only if separately approved later.

- This would require separate implementation approval.
- This may require a local-only harness or test page.
- This is not approved by this plan.
- Do not create local test files under this plan.

## Unsafe / Not Allowed Methods

- Do not edit the live CSV URL.
- Do not commit temporary URL changes.
- Do not change parser code.
- Do not change live preview logic.
- Do not change daily table gate behavior.
- Do not change Dashboard hero/cards/charts.
- Do not block all network traffic if it prevents the app shell from loading.
- Do not deploy.
- Do not simulate failure by manually editing DOM text.
- Do not add dependencies or tooling.

## Expected PASS Criteria

The simulation passes only if all of the following are true:

- Dashboard loads.
- App Shell v2 remains active.
- Fetch failure status is visible.
- Parser does not falsely report `ok` from a failed fetch.
- Daily table is not blank.
- Daily table returns to sample/fallback state.
- Source note is not misleading.
- No page-wide overflow.
- No blocking console error caused by app code.
- Dashboard hero/cards/charts remain sample/prototype.
- CSV remains daily-table-only.

## Expected Report Fields

The P3 simulation report should include:

- Tooling used.
- Exact request blocked.
- Dashboard HTTP status.
- Fetch status text.
- Parser status text.
- Daily table source note.
- Daily table row count.
- Daily table state.
- Console result.
- Boundary result.
- Final P3 decision.

## P3 Closure Decision

Use these decision rules:

- CLOSE P3 if safe targeted simulation passes.
- KEEP P3 OPEN if simulation cannot be run safely.
- ESCALATE if fallback fails, daily table blanks, source note is misleading, or app crashes.

If P3 remains open, controlled use may continue as long as no P0/P1/P2 issues appear and the owner accepts the tracked P3 note.

## Guardrails

- No code changes.
- No parser changes.
- No CSV behavior changes.
- No live CSV URL changes.
- No daily table gate changes.
- No Dashboard hero/cards/charts changes.
- No backend/Auth/Firebase/API.
- No AI/Chat/Stock/OCR/Loan Calculator.
- No PDF/Excel/file export.
- No dependency/tooling changes.

## Recommended Next Step

- Review and approve this plan first.
- Then run a read-only P3 simulation only if tooling supports safe Google-CSV-only request blocking.
- If tooling still does not support safe targeted request blocking, keep P3 open as a tracked non-blocking note.
- Do not implement any behavior change unless a real issue is found and separately approved.

## Plan Closure Statement

This plan supports a read-only confidence check only.

It does not approve code, parser, CSV, live URL, Dashboard, dependency, backend, AI, export, or deployment changes.
