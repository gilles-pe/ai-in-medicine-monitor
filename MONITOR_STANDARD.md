# AI in Medicine - Editorial & Data Standard
Version: 1.0 | Date: 2026-10-18 | Status: operational specification

## 1. Purpose and audience
A public-facing, popular-science view of progress in medical AI. Designed for physicians, healthcare leadership, industry and interested non-specialists. It is not a medical-device certification, clinical safety claim, or scientific meta-analysis.

The three questions are:
1. **Medical Knowledge** - How well does AI answer medical examination questions?
2. **Clinical Assistance** - How well does AI respond to realistic clinical questions and tasks?
3. **Autonomous Workflows** - How reliably does AI finish multi-step medical tasks?

## 2. Authoritative source files
- `data/monitor-data.json`: portable factual data, benchmark definitions, model points, references and status.
- `MONITOR_STANDARD.md`: editorial and evidence policy (this file).
- `DESIGN.md`: interface and interaction rules.
- `AGENTS.md`: instructions for any AI assistant working with the project.

A database server is not required. JSON is portable to charts, slides, websites and other AI models. Changes should be version-controlled. Never silently replace or erase a historical record.

## 3. What the trendline means
Main line = **best documented eligible result to date within ONE comparable benchmark series** (historical frontier / running maximum). Other evaluated models appear as subdued independent dots. It is not average AI ability or real-world clinical competence.

Eligible = verified primary evidence, exact benchmark variant, sufficiently comparable protocol, date justified, complete source link. A single paper can contain many models but does not by itself create many contemporaneous measurements.

- Plot chronological position using `modelReleaseDate` as an *availability proxy*, visibly disclosed. Use `evaluationDate` and `publicationDate` in details. A tested historical model is not evidence that the test was available at release.
- Retrospective points must be visually indicated (e.g. hollow circle/dotted segment and 'tested later').
- Equal release dates: plot as a cluster; select highest eligible result for the running maximum.
- Within each benchmark, line never falls merely because a weaker model was tested later. Never interpolate unsupported missing years.
- Never join separate benchmark `seriesId`s, even if both report a percentage. Multiple series can share the calendar x-axis but must be visually distinct.
- Where data are sparse, show a gap or annotate 'No comparable results available'.
- `isFrontier` in imported files is a *claim to review*, not the trusted source of the plotted line. Derive the frontier from eligible points.

## 4. Comparison discipline
A result is comparable only if dataset version, scoring metric, task subset, scoring implementation, prompting/agent harness and tool access are sufficiently aligned. Different tools or ensemble methods can represent system-level progress, but must be named in the card. Where methods materially differ, keep a separate series or label the comparison illustrative rather than precise.

Do not turn benchmark points into 'X% of doctors replaced', 'X% clinical accuracy', or 'X% safe care'. Reference baselines must be tested on exactly the same benchmark/protocol or labeled as context only. In particular, a USMLE pass percentage is not an official MedQA pass threshold.

## 5. Data inclusion and validation
Source preference: (1) original peer-reviewed paper + tables, (2) original preprint or benchmark technical report, (3) official versioned leaderboard with methodology, (4) supplier testing clearly tagged as such. News articles are leads, not final proof.

Every eligible main-line point requires: model/system name, exact score and unit, benchmark/version, release and measurement/publication dates when available, test setup, human-readable meaning, original source **URL**, specific page/table/row if possible, and a comparison assessment.

Use `validation.status`:
- `confirmed`: value + benchmark + setup checked against a primary/official source, with a valid URL and review timestamp.
- `reported`: vendor-reported original claim, source checked, not independently established as directly comparable.
- `needs_review`: attribution, date, setup, score or source not yet checked. Excluded from the published frontier until reviewed.

Separate `validation.comparability` (`same_protocol`, `qualified`, `different_protocol`, `unknown`) from truth of the numeric claim. A confirmed result with `different_protocol` is not eligible for the same line. Mark promotional claims and the testing agent's caveats.

Do not infer URLs from bibliography titles. Never mark a point confirmed merely because its imported JSON said `verified: true`. Include a correction note whenever data are changed.

## 6. Narrative and chart copy
Always show plain-language labels first, metric and source second. Say what is actually tested. A score such as 'HealthBench 59 points' is a rubric score, not '59% correct diagnoses'. Prefer 'Best tested result on this benchmark' over 'AI is at 95%'. Use short sentences and avoid unsupported clinical extrapolation.

## 7. Data workflow
1. Read existing database and identify each benchmark's latest published/verified record.
2. Search for updated results on the **same benchmark version and setup** before proposing new benchmarks.
3. Retrieve original papers/reports and confirm numbers, dates, units and system configurations.
4. Add candidate records with `needs_review` and source details; preserve original imported observations.
5. Review and set validation fields; only then allow main-line inclusion.
6. Recalculate frontier from eligible records and inspect ties, discontinuities, retrospective dating and apparent improvements.
7. Update `meta.lastReviewedAt` only when review actually occurs; update `meta.lastDataChangeAt` only for data changes. Both differ from latest evaluated-model release date.
8. QA the visual on desktop and mobile, and test all source links and card texts.

## 8. File structure and identifiers
`data/monitor-data.json` is valid UTF-8 JSON without comments. Maintain stable unique point IDs and stable series IDs; don't repurpose them. Preserve original `legacy` payload for audit where imported. Dates are ISO `YYYY-MM-DD` when known or `YYYY-MM` when only a month is supported; date precision is explicit. Missing information is `null`, never invented. Source links are HTTPS strings or null pending verification. All percentage-like metrics carry their true scale and meaning.

## 9. Editorial card/data consistency
`editorialCards` is the canonical detail-content registry in the portable JSON. Each active record has a stable `cardId`. A card contains a semantic badge, tags array, finding (headline/explanation/value/unit/kind), setup, concrete limitations, short teaser, timeline_year, evidence_date, date_basis, timeline_note, sources with separate journal_citation, and validation. Numerically measured findings must equal their chart observation. Historical concepts state documented categorical outcomes rather than fabricated numeric performance.

Keep score truth, comparison protocol and chronology separate. Confirmed but qualified MedQA results stay unconnected. Clinical product harnesses cannot join the base-model line. A score without a verified publication or availability date is retained in an accessible unplaced-results list; an unknown publication date is shown only at/after the audit date in historical views. No invented dates or performance lines.

## 10. Release checklist
- [ ] Every chart says what was tested and what the score means.
- [ ] Main-line points are confirmed and comparable.
- [ ] Retrospective results are labeled and dated properly.
- [ ] Benchmark transitions are not connected.
- [ ] Hover / tap / keyboard card works with readable sources.
- [ ] No clinical safety implication beyond the benchmark evidence.
- [ ] Latest review date is honest and visible.
- [ ] Exported JSON validates and all IDs are unique.

<!-- monitor-data-contract:start -->
## Generated data contract

This section is generated from `data/monitor-data.json`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.

- Schema: 1.1
- SHA-256 (parsed JSON): `3a645ceadb69400fd5570ea62167b43d5a6ef2d41f747377dac9a388d479ed56`
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
