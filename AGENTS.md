# AGENTS.md - Instructions for AI collaborators
Version: 1.0 | Date: 2026-10-18

## Mission
Maintain a popular-science 'AI in Medicine' showing medical AI progress in three tracks. Clear for physicians, healthcare industry and non-experts. Credible but not framed as a medical clinical validation study.

## Read before work
1. `MONITOR_STANDARD.md` - editorial/evidence rules, frontier definition and criteria.
2. `DESIGN.md` - UI, chart and point-card requirements.
3. `data/monitor-data.json` - portable data store.
4. `VALIDATION_REPORT.md` - current evidence audit and unresolved blockers.

## Universal operating constraints
- Never program or redesign unless asked; a research task produces candidate data and sources.
- Never overwrite or discard previous points without a change log.
- Do not silently convert manufacturer assertions into independently verified findings.
- Do not silently bridge benchmarks or project future results.
- Do not infer evaluation dates from release dates.
- A chart's x-axis uses released-model availability as a proxy and must state that fact.
- The *published main line* is a running maximum of eligible confirmed, comparably evaluated points within each series - NOT a line connecting every model result.
- Put concise plain-English explanations in each point card; explanations must match the test.
- Never use an unverified URL or fabricate a missing date, source, score or test protocol.

## Research agent: task procedure
1. Read current JSON; identify track, exact benchmark name/version and latest reviewed source.
2. Search primary sources for new scores on existing benchmarks first; then propose any new benchmark separately.
3. For each candidate capture exact benchmark, metric, score, model/system, release date, evaluation/publication dates, prompt/tool/harness configuration, exact primary URL and table/figure location.
4. Update the canonical editorial card: quantitative/comparative finding, teaser, setup/cohort, actual limitations, source footer and evidence date/version. Keep legacy `explain` compatibility fields consistent. Never duplicate citations in setup text.
5. Set validation status honestly: `confirmed`, `reported`, or `needs_review`; set comparability separately.
6. Deliver a JSON patch proposal/change log. Flag conflicting sources and methodology changes for human review.

## Validation agent: task procedure
- Independently open and check the stated primary source, number, units, date and condition.
- Compare benchmark version/setup to other points in *same series*.
- Mark a point eligible for main line only if `status=confirmed`, `comparability=same_protocol` (or carefully documented `qualified` with explicit approval), and working source URL.
- Retrospective means benchmark evaluation performed after the model's first public availability; show as such.
- Record reviewer, review date and short rationale. Do not infer confidence from source title.

## Dashboard agent: task procedure
- Treat JSON as read-only content authority. Do not modify underlying score/source facts to improve the visual shape.
- Render chart and details following `DESIGN.md`. Ensure mobile tap and keyboard interactions.
- Recalculate frontier by benchmark series at render time from eligible points.
- Display date/measurement and benchmarking limitations explicitly but concisely.
- Test source URLs, gaps, ties and benchmark transitions.

## Public communication agent: task procedure
- Use clear questions and concrete comparisons. Avoid exaggerated 'doctor replacement' claims.
- Link directly to original sources when making quantified claims.
- Explain measured metric rather than relying on generalizations about clinical competence.

## Portable data contract
Location: `data/monitor-data.json` (UTF-8 JSON). Sections: `meta`, `tracks[]`, `tracks[].series[]`, `series[].data[]`. Point keys: `id`, `model`, `modelReleaseDate`, `evaluationDate`, `publicationDate`, `value`, `setup`, `explain`, `validation`, `sources`, `legacy`. Track and series definitions provide user-facing title, axis/metric description and methodological warnings. `sources` should be structured with `url` and `locator` when verified. All unknowns are null or needs_review.

## Editorial card maintenance
Every active point, study and milestone references the shared `editorialCards` registry by stable `cardId`. Card content must agree with chart values and validation status. Preserve old imported content in the change log/archive. Read the schema 2.0 card contract in DESIGN.md. Historical conceptual events use documented categorical outcomes, not invented IQ or accuracy values.

## Before declaring ready
Check JSON parses, IDs unique, every published line point eligible, no joined incompatible series, source links valid, point cards complete, mobile behavior, and last-updated semantics. Produce a brief list of unresolved issues for the human owner.

<!-- monitor-data-contract:start -->
## Generated data contract

This section is generated from `data/monitor-data.json`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.

- Schema: 1.1
- SHA-256 (parsed JSON): `75d74d1ea2e1aab0ca2d6a8e904d9a651856b2bb01b9ab4ef8fc4fcc2ca4acd8`
- Tracks / benchmark series / measurements: 3 / 6 / 44
- Score validation: 38 confirmed, 1 reported, 5 under review
- Main-line eligible scores: 31; original-link gaps: 2
- Chronology: 44 unknown evaluation dates; 40 month-precision release proxies
- Last evidence review: 2026-10-18; last data change: 2026-10-18
- Calendar positioning uses model availability proxies, not evaluation dates. Confirmed scores do not validate release-month chronology or source-publication dates and versions.
- Frontier must be recalculated separately within each benchmark series. Pending and qualified-only records do not form a confirmed main line.
- Source policy: MONITOR_STANDARD.md; interface: DESIGN.md; collaboration: AGENTS.md.

Run `node scripts/sync-monitor-docs.mjs` after a JSON change, and `node scripts/sync-monitor-docs.mjs --check` before release. Structural checks do not constitute independent scientific validation or live URL verification.
<!-- monitor-data-contract:end -->
