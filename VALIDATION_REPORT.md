# Evidence validation report
Updated: 2026-10-18

## 2026 addition
Three published Nature Medicine results use the same 500-item MedQA subset with search: GPT-5.2 94.2%, Claude Opus 4.6 90.2%, Gemini 3.1 Pro Preview 97.4%. Publication: 12 June 2026, Fig. 2a. This is a distinct study-specific series, not comparable to historical full-test MedQA. Provider search and inference settings are not compute-matched; training overlap and these conditions are stated in each card. The documented methodological criticism is not grounds for concealing the source conditions or treating the score as clinical validation.

## Original numeric audit
All 41 original observations and their numeric values are retained; 3 separately sourced 2026 MedQA observations have been added. The second audit reviewed the 23 previously pending records plus Flan-PaLM.

- 38 numerical claims are source-checked. At whole-record level: 35 confirmed, 1 supplier-reported, 5 under review (3 source-checked Meerkat values with unresolved test setup plus 2 unresolved numerical claims).
- 28 scores qualify for their benchmark-specific frontier: 5 HealthBench Core, 6 HealthBench Professional base-model evaluations, and 17 agent-benchmark scores.
- The 9 MedQA results use different training/prompting/retrieval configurations or unresolved commercial-model setup. They do not form a confirmed comparable time trend.
- ChatGPT for Clinicians uses a product harness and remains separate from the base-model frontier, despite its supported 59.0 score.
- Corti Symphony remains a supplier-reported claim with unverified evaluation configuration and publication date.
- Claude Opus 4.8 / Mythos imported HealthBench Professional scores remain unverified. No original numerical table was retrieved. They are excluded from the dated curve and confirmed frontier.
- All evaluation dates remain unknown. 40 release months are approximate imported availability proxies, not measured test dates. GPT-4-base is non-production with no established public availability date.

## Corrections applied
- PubMedGPT/BioMedLM 50.3% used full MedQA fine-tuning (10 epochs, batch 8, learning rate 2e-6), not zero-shot.
- GPT-4-base 86.1% belongs to non-production base-model results added on 12 April 2023. The public GPT-4 launch is not its availability date.
- Med-PaLM 2 86.5% is the MedQA-only tuned variant; unified ensemble refinement scored 85.4%.
- GPT-4o 83.6%, o1 95.7%, o3-mini 91.8% are supported by the Meerkat paper (npj Digital Medicine 8, 240, 2 May 2025), not the imported ReMedQA/March attribution. Commercial-model prompting and snapshots remain unresolved; these three complete records stay under review despite verified numeric claims.
- HealthBench Core's 15.54/32.33/42.00/47.78/59.90 are original Table 7 means across 16 runs, displayed as rubric points rather than diagnostic accuracy.
- Seven HealthBench Professional claims are supported by original Figure 4. The Grok label is 4.20. Product and base-model setups are distinguished.
- AMIE's final Nature paper appeared 9 April 2025 (Nature 642, 442–450). Its final study uses 159 scenarios, 20 PCPs, 30/32 specialist axes and 25/26 patient-actor axes. The 2024 preprint had different counts; no unsupported ~59% versus ~34% top-1 claim is used.

## Evidence-card audit
110 canonical cards cover every active benchmark, legacy comparison, overview point, historical event and study. These use source-specific setup and limitations. Six conceptual/historical outcomes remain categorical: dates or sample counts are not invented performance metrics. Historical cards do not become comparable benchmark observations merely by having an original link.

The detailed 24-record review is stored in `extensions.researchAudit` inside the portable JSON, and in `docs/missing-metrics-audit.md`. Each changed numeric record retains `legacy.beforeResearchReview20261018`; the original source/flags remain available.

## Remaining work
1. Retrieve the original Anthropic system-card table and grader configuration for the two unresolved claims.
2. Audit Meerkat commercial-model prompts/snapshots and all MedQA protocol differences.
3. Verify model availability dates independently; do not confuse publication with evaluation or release.
4. Retrieve a dated Corti evaluation report with exact grading conditions.
5. The 41 observations are a selected dataset, not a comprehensive current leaderboard.

<!-- monitor-data-contract:start -->
## Generated data contract

This section is generated from `data/monitor-data.json`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.

- Schema: 1.1
- SHA-256 (parsed JSON): `9c60d4b611cf3afe1807032f74f97ab1d912055bb55946b48031d5f38b147195`
- Tracks / benchmark series / measurements: 3 / 6 / 44
- Score validation: 38 confirmed, 1 reported, 5 under review
- Main-line eligible scores: 31; original-link gaps: 2
- Chronology: 44 unknown evaluation dates; 40 month-precision release proxies
- Last evidence review: 2026-10-23; last data change: 2026-10-25
- Calendar positioning uses model availability proxies, not evaluation dates. Confirmed scores do not validate release-month chronology or source-publication dates and versions.
- Frontier must be recalculated separately within each benchmark series. Pending and qualified-only records do not form a confirmed main line.
- Source policy: MONITOR_STANDARD.md; interface: DESIGN.md; collaboration: AGENTS.md.

Run `node scripts/sync-monitor-docs.mjs` after a JSON change, and `node scripts/sync-monitor-docs.mjs --check` before release. Structural checks do not constitute independent scientific validation or live URL verification.
<!-- monitor-data-contract:end -->
