# Audit report - 18 October 2026

## Result

- **41 imported measurements** remain in the portable JSON.
- **18 score records checked against primary evidence**: 9 Stanford MedAgentBench, 8 Microsoft HealthAgentBench, 1 Flan-PaLM/MedQA.
- **23 records remain pending** source- and protocol-level audit.
- **17 points eligible for benchmark-specific agent charts** based on primary score evidence and a common benchmark protocol, with chronological positioning using provisional model-release-month proxies.
- **Medical Knowledge and Clinical Assistance are NOT publication-ready as confirmed-only continuous frontier charts**. Use visibly labeled preview or complete their audits before publishing.

## Evidence sources

1. Stanford ML Group, MedAgentBench - https://stanfordmlgroup.github.io/projects/medagentbench/ , Table 2.
2. Microsoft Research, HealthAgentBench - https://microsoft.github.io/HealthAgentBench/ , Leaderboard.
3. Nature, *Large language models encode clinical knowledge* - https://www.nature.com/articles/s41586-023-06291-2 , MedQA result discussion.
4. OpenAI, HealthBench - https://arxiv.org/html/2505.08775 (background checked, individual imported precise means still need verification).
5. OpenAI, HealthBench Professional - https://arxiv.org/html/2604.27470 (benchmark identified, not all third-party scores or protocols verified).

## Corrections

- 1.1: 67.6% belongs to Flan-PaLM 540B, not Med-PaLM. Marked `qualified` pending cross-study protocol judgment.
- 1.0a: imported `isFrontier` flag was wrong for same-month comparison and is now false; 50.3% supported by Nature secondary quotation, original source still pending.
- 1.5: retrospective flag adjusted to true.
- 3.9: 85.33% - 54.00% is a **31.33 percentage-point** difference, not a 31.33% relative change.

## Open issues

1. Verify exact primary source and scoring conditions for remaining Medical Knowledge results, particularly 1.4-1.6, saturation ceiling and human expert references.
2. Verify all five exact HealthBench Core scores and all 10 HealthBench Professional records against first-party tables; some professional records use vendor-specific graders and therefore may need separate visual groups.
3. Audit exact release dates for all models. An approximate release month does not mean a benchmark was measured then; report date explicitly.
4. Check whether benchmark-scoring protocol versions were changed during vendor reports.
5. Add verified primary links and precise page/table locator to all remaining cards.
6. The original 41 records are a *selection*, not an exhaustive 2026 up-to-date leaderboard. A separate refresh is needed before claiming a comprehensive current frontier.

## Import rules for dashboard

- Show `validation.status=confirmed` results normally.
- Show `needs_review` points only in explicitly labeled draft/preview mode, never silently as confirmed frontier.
- Do not show a misleading empty line as 'no progress'; instead show 'data being verified' or preview with disclaimer.
- Never connect MedAgentBench and HealthAgentBench series.
- Cards: show test, metric meaning, source link, limits, and date distinction.

<!-- monitor-data-contract:start -->
## Generated data contract

This section is generated from `data/monitor-data.json`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.

- Schema: 1.0
- SHA-256 (parsed JSON): `464446fcd78931cd924955d793c2dfe363aae7c86c7b670677dfd85437b6a2df`
- Tracks / benchmark series / measurements: 3 / 5 / 41
- Score validation: 18 confirmed, 0 reported, 23 under review
- Main-line eligible scores: 17; original-link gaps: 22
- Chronology: 41 unknown evaluation dates; 41 month-precision release proxies
- Last evidence review: 2026-10-18; last data change: 2026-10-18
- Calendar positioning uses model availability proxies, not evaluation dates. Confirmed scores do not validate release-month chronology or source-publication dates and versions.
- Frontier must be recalculated separately within each benchmark series. Pending and qualified-only records do not form a confirmed main line.
- Source policy: MONITOR_STANDARD.md; interface: DESIGN.md; collaboration: AGENTS.md.

Run `node scripts/sync-monitor-docs.mjs` after a JSON change, and `node scripts/sync-monitor-docs.mjs --check` before release. Structural checks do not constitute independent scientific validation or live URL verification.
<!-- monitor-data-contract:end -->
