# AGENTS.md - Instructions for AI collaborators
Version: 1.1 | Date: 2026-10-25

## Mission
Maintain a popular-science 'AI in Medicine' showing medical AI progress in three tracks. Clear for physicians, healthcare industry and non-experts. Credible but not framed as a medical clinical validation study.

## Read before work
1. **`docs/MEASUREMENT_INTAKE.md` - MANDATORY evidence AND material-impact gates BEFORE proposing, adding, publishing or promoting any new measurement, study, milestone or clinical-news claim. Escalation to the owner is required for borderline cases; never assume consent.**
2. `MONITOR_STANDARD.md` - editorial/evidence rules, frontier definition and criteria.
3. `docs/EVIDENCE_TAGGING.md` - MANDATORY topic, patient-test setting, study design and milestone rules for EVERY evidence entry.
4. `DESIGN.md` - UI, chart and point-card requirements.
5. `data/monitor-data.json` - portable data store.
6. `VALIDATION_REPORT.md` - current evidence audit and unresolved blockers.
7. `FUNCTIONALITY.md` - current features, interaction requirements and release acceptance.
8. `TODO.md` - canonical active backlog; `docs/TODO.md` is historical.
9. `docs/decisions.md` and `docs/implementation-status.md` - approved decisions and per-run change/test history.
10. `docs/NEWS_COVERAGE.md` - archive provenance, exclusions and access limits.
11. `docs/data-entry-guide.md`, `data/news.json`, `docs/news-editorial.md` - portable content entry and approved news.

## Evidence classification - required on every new item
- Follow `docs/EVIDENCE_TAGGING.md` and the machine vocabulary in `data/monitor-data.json` -> `meta.evidenceTaxonomy`. Add or verify `editorialCards[cardId].classification` before publishing a new evidence record; leave unknowns explicit.
- Differentiate exam/vignette benchmarks, **offline clinician-chat benchmarks (HealthBench Professional)**, simulated workflows, actor studies, retrospective actual records and prospective real-patient studies. A case-based RCT is NOT a real-patient clinical RCT; peer review is NOT clinical validation.
- `clinician_chat_benchmark` is a source-checked TEST SETTING (not the topic `clinical_evidence` nor proof of real-patient care). Only apply to offline clinician-authored professional-chat tasks after inspecting cohort and grader; **do not conflate HealthBench Core with HealthBench Professional**. See the owner-approved exception/rule in `docs/EVIDENCE_TAGGING.md`.
- A `milestone` flag is editorial significance, not an evidence level. Do not add without explicit justification and approval. Preserve `patientOutcomeEvidence=false/null` unless actual outcomes were assessed.
- Use the same classification in cards, milestones, Data tables, Glossary and news with `linkedCardId`. Do not create parallel tags from free-form `tags[]`.

## Admission gate - mandatory and separate from technical validation
- No new record is admitted merely because a model score is higher, a paper is prestigious or a supplier describes a breakthrough. Apply **Gate A (original evidence, protocol and exact metric)** AND **Gate B (meaningful clinical/scientific or capability impact)** in `docs/MEASUREMENT_INTAKE.md`. Fail either: hold/reject with a recorded reason, not an automatically published item.
- Distinguish a benchmark measurement, independent study card, owner-approved Milestone and owner-approved news. A technically correct result can be too unimportant or duplicative to include. Negative comparative evidence may be more important than a benchmark record.
- In any serious doubt about impact, clinical meaning, study design, comparability, new taxonomy/series or admission, send the owner a short decision brief and wait for a clear decision before modifying the public dataset. Never infer approval from silence.
- Every owner decision is logged in `docs/decisions.md`. Use that feedback to **revise the written rules** in `docs/MEASUREMENT_INTAKE.md` or `docs/EVIDENCE_TAGGING.md` and relevant validation tests, and re-check comparable existing items. Do not silently turn a one-off exception into policy.
- Historical audit work proceeds by unique study/source/cohort; read `docs/HISTORICAL_EVIDENCE_AUDIT_2026-10-25.md`, distinguish reviewed versus provisional classifications and publish only substantiated changes. An audit PR is not a source of new evidence by itself.

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
1. Read `docs/MEASUREMENT_INTAKE.md`, current JSON and audit ledger; identify duplicates, study cohort, exact benchmark name/version and latest reviewed source.
2. Search primary sources for new scores on existing benchmarks first; then propose any new benchmark separately.
3. For each candidate capture exact benchmark, metric, score, model/system, release date, evaluation/publication dates, prompt/tool/harness configuration, exact primary URL and table/figure location.
4. Update the canonical editorial card: quantitative/comparative finding, teaser, setup/cohort, actual limitations, source footer and evidence date/version. Keep legacy `explain` compatibility fields consistent. Never duplicate citations in setup text.
5. Set validation status honestly: `confirmed`, `reported`, or `needs_review`; set comparability separately.
6. Apply both editorial gates. Deliver a candidate decision (Add / Hold / Reject / Milestone proposal) with evidence, impact rationale and JSON patch only if eligible. Flag borderline conclusions for the owner before inclusion; record owner decisions and policy revisions.

## Validation agent: task procedure
- Historical reviews must cover original Methods/Results and record exact scope, audited card IDs and primary locators in the audit ledger. Source-checked score and classification-reviewed setting are independent; do not upgrade one because of the other.
- Independently open and check the stated primary source, number, units, date and condition.
- Compare benchmark version/setup to other points in *same series*.
- Mark a point eligible for main line only if `status=confirmed`, `comparability=same_protocol` (or carefully documented `qualified` with explicit approval), and working source URL.
- Retrospective means benchmark evaluation performed after the model's first public availability; show as such.
- Record reviewer, review date and short rationale. Do not infer confidence from source title.

## Dashboard agent: task procedure
- Treat JSON as read-only content authority. Do not modify underlying score/source facts to improve the visual shape.
- Render chart and details following `DESIGN.md`. Ensure mobile tap and keyboard interactions.
- Capability questions refer to AI, not the owner: use What can AI do in medicine today? Reserve first-person I for the owner’s introduction/profile. Keep complete English/German UI phrases together in the portable locale registry.
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
Check JSON parses, IDs unique, every published line point eligible, no joined incompatible series, source links valid, point cards complete, mobile behavior, and last-updated semantics. Update `meta.lastReviewedAt` only after actual evidence review and `meta.lastDataChangeAt` for factual data changes. UI/news changes do not imply scientific review. Run `node scripts/sync-monitor-docs.mjs` after central JSON changes. Test the built dist artifact under the GitHub project subdirectory, including phone taps, source cards, grouped selection and full-view controls. Append this run's changes, actual checks, source and publication result to `docs/implementation-status.md`; update root `TODO.md`. Produce a brief list of unresolved issues for the human owner.

## Interesting news
`data/news.json` contains the separate editorial feed. Ask the user to approve each proposed story before adding it. Retain original publication dates and sort newest first; group cross-posts as source links beneath the original story. Mark every Substack item with a star. The dashboard shows the newest four items and All opens the complete `/news/` archive. Do not automatically import or publish unapproved posts. News additions do not imply a benchmark evidence review.

## Hosting and publication
The primary publication target is GitHub Pages at `https://gilles-pe.github.io/ai-in-medicine-monitor/`, from the public `gilles-pe/ai-in-medicine-monitor` repository. Publish changes through `main` and the `Publish GitHub Pages` workflow; verify its deployment result before reporting them live. Keep asset and navigation paths relative so the project subdirectory works. `.openai/hosting.json` and the former Sites deployment are retained as a fallback; they are not the primary publication target.

<!-- monitor-data-contract:start -->
## Generated data contract

This section is generated from `data/monitor-data.json`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.

- Schema: 1.1
- SHA-256 (parsed JSON): `8bbe22eff02970fb0e4709d3d60b59ffa19a84f476b4e927524466bca2b35fad`
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

The owner explicitly authorized the 25 October 2026 historical-post import. Crossposts are one item with several verified URLs; follow one original per story, never invent unavailable X/LinkedIn links or article dates. See docs/decisions.md and docs/NEWS_COVERAGE.md for current news design and coverage.
