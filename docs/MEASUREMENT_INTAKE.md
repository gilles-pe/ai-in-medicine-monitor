# Measurement intake, verification and editorial admission gate
Version 1.1 | 2026-10-25 | normative, before any insertion of a new benchmark, study, milestone or source-backed news

## Mandatory reading / authority
Every research, validation, data-entry, news or publishing agent MUST first read:
1. `AGENTS.md` (entry point).
2. **This document**: new-item evidence/impact gate and escalation.
3. `docs/EVIDENCE_TAGGING.md`: what was actually tested, not what a headline claims.
4. `MONITOR_STANDARD.md`: source, dates, comparability and frontier construction.
5. `docs/data-entry-guide.md`: exact canonical JSON collections and release tests.

The approved content lives only in `data/monitor-data.json` (studies, cards, milestones and numeric tracks) and separately owner-approved `data/news.json` (editorial posts). `docs/HISTORICAL_EVIDENCE_AUDIT_2026-10-25.md` is a source-audit ledger, not a competing source of facts.

## Mandatory two-key editorial gate: credible ENOUGH AND important ENOUGH
The default is **do not publish**. A compelling headline is not an admission rule.

### Gate A - evidence eligibility (hard stops)
For a new measurement, require:
- Read the ORIGINAL paper, validated leaderboard or complete technical report, including Methods and tables, not only press coverage. Record exact version, direct HTTPS URL and section/table/figure/row. If full text cannot be checked, leave as research candidate and do NOT claim `confirmed`.
- State explicitly: what was measured, exact score/units/denominator, baseline/comparator and whether paired; human or synthetic input; number of cases/patients and sample selection; CI/p-value where the paper supplies it; evaluator/grader, prompt and tools/harness; publication, measurement and model-release dates separately, allowing null.
- Distinguish exam/vignette, curated clinician chats, retrospective real records, simulated EHR/patient actors, prospective real-patient testing and routine healthcare; document what is NOT shown (especially actual patient outcomes).
- Establish the exact model/system identity, original protocol and whether the metric is comparable to an existing benchmark. If not, new series or qualitative study; **never join incompatible numeric lines**.
- Detect duplicates, reprints, new versions of the same cohort, baseline/context repeats, cherry-picked subsets, undeclared vendor involvement, data leakage and missing negative results.
- `confirmed` describes a source-checked numerical/protocol claim, NOT clinical validity, replication or independent model performance. Mark manufacturer-only original data as `reported`; unresolved claims as `needs_review`.
- If any critical claim (metric, sample, version, protocol, source provenance or clinical setting) is unknown, do not silently fill it and do not place on a confirmed trend.

### Gate B - practical impact / significance (independent hard stop)
Answer the counterfactual: **If we omit this item, what important change in what AI can do for medicine would a reader miss?**
Admit only when at least ONE of these is defensible AND supported by Gate A:
1. Meaningful, methodologically credible advance within an EXISTING comparable benchmark, taking sample uncertainty, saturation, tools and statistical/effect-size interpretation into account. A higher value is not automatically meaningful; no universal percentage-point threshold across unrelated tests.
2. A genuinely new, harder or more clinically realistic capability, endpoint or benchmark that resolves a real blind spot in the monitor. Explain why it is more meaningful than the older test; don't build charts merely because a source has a percentage.
3. Important clinical evidence with real users/patients or a robust comparative finding (including **negative** findings), with material relevance to clinician workflow, patient access, safety or outcomes. A controlled vignette study may merit a clinical-evidence card but is NOT a patient-outcome trial.
4. Verified scaled routine deployment or a new biological/diagnostic discovery of substantial explanatory/clinical potential, with independently documented evidence and a real mechanism, not just adoption PR.
5. A historically pivotal foundation that makes the timeline more understandable and is not a repeat of an already represented milestone.

A source can pass **source verification** and FAIL **admission** as trivial, redundant, poorly generalizable, PR-driven or misleading. Keep it in the research queue/rejection log; do not hide negative evidence when it materially changes the picture.

### Clinician-chat benchmark - owner-approved classification precedent
The owner approved a distinct **`clinician_chat_benchmark` test setting** for offline professional tasks from real-origin clinician–AI conversations (notably HealthBench Professional, 2026). The fact that original clinicians may have used AI at work **does not turn an offline re-evaluation into a prospective patient study or evidence of improved outcomes**. Match actual benchmark cohort, prompt, grader/rubric, difficulty selection, original publication and model-vs-product harness. The original general HealthBench Core (2025) is a different, broader set of mostly synthetic health conversations and must NOT be relabeled as clinician-only or numerically bridged to Professional. Existing supplier-only or missing-source scores stay unverified/provisional despite a shared test-setting category. This owner's classification decision does NOT grant automatic admission to new studies, new benchmark series or milestones: both Gate A and Gate B still apply.

### Editorial destinations (do not conflate)
- **Existing benchmark data point**: passes Gate A and B, exact existing metric/protocol/version, same series (or explicitly new independent series), reusable timestamp + limitations. `status` and `comparability` determine whether shown/connected.
- **Study/evidence card**: informative clinically/biologically even if not numerically comparable; fully describe setting and findings. Do not invent a score to put it on a chart.
- **Milestone**: a THIRD, stricter editorial decision. Require a first-of-kind/step-change/independent clinical adoption or turning point, meaningful durable historical importance, and explicit written rationale. Milestone may be simulated; never equate this flag with prospectively validated care. Require explicit owner approval for new milestones.
- **News**: separate owner-approved feed; interesting commentary is not validation and a release announcement is not a milestone.
- **Reject / research backlog**: fails gates or needs source completion; retain citation and reason without promoting it into the visible database.

## Triage and decision procedure
0. Search canonical JSON and audit ledger for existing `cardId`, `sourceId`, DOI and cohort BEFORE evaluating as novel.
1. Write a six-line candidate brief: (i) source/DOI/version, (ii) what was tested and with whom, (iii) key numerical result + matched comparator/uncertainty, (iv) evidence limitations/clinical setting, (v) impact / why reader should care, (vi) recommended destination - include *reject* as a real option.
2. Independently validate Methods and quantitative table; tag `classification` using EVIDENCE_TAGGING. Separate review states for claimed score, interpretation and clinical evidence.
3. Apply Gate A (hard evidence) and Gate B (material impact) independently; choose a destination or `hold`.
4. If standard, clearly source-backed update of an already accepted SAME-PROTOCOL series with material value: propose a precise JSON patch with source and change log; publishing still follows the current authorization/release protocol. Do not silently accept new study families or milestone flags.
5. **Ask the user before inclusion** whenever evidence or impact is borderline, the meaning of a benchmark is debatable, a clinician-versus-AI comparison could mislead, the source is vendor-only, a fresh category/new benchmark is proposed, or classification depends on an unresolved distinction (e.g. curated real clinician chats vs patient cases).
6. Supply a compact choice to the user: **Add / Hold for more evidence / Reject / Milestone?** with your recommended option, 1-2 precise reasons, exact uncertainties and primary links. Do NOT default to Add because the user has not replied.
7. On owner decision, record date, selected choice and rationale in `docs/decisions.md`, note the candidate identifier in the change log and update `TODO.md`. If feedback reveals a weakness in these gates, revise this policy and the tagging document, version them, add or modify tests where relevant, and apply the clarified rule to comparable existing items. **Never claim policy was strengthened solely by asking a question**; the actual written policy is the source of truth.
8. No recursive candidate creation based on secondary articles. No score, cohort, publication date or `meta.lastReviewedAt` is changed unless that exact fact was actually re-checked. Historical audits must be clearly scoped to items audited and recorded in the audit ledger.

## Escalation examples
- New supplier statement: "diagnoses 90% more accurately" without accessible comparator/cohort -> **Hold**; request complete protocol from source/owner. Do not chart.
- New MedQA result from an existing, same-version benchmark, original table and matched setup, historically meaningful improvement -> possible benchmark candidate, NOT clinical validation.
- Randomized comparison of physicians solving paper vignettes -> `randomized_simulation`, not `randomized_clinical_trial` involving real patients. Could be an important negative clinical-assistance study.
- Real, prospective patient interaction with no randomized arm or outcome benefit -> `prospective_single_arm`; can be important evidence, not proof of improved care.
- Scientific abstract claims milestone but only reproduces old cohort or adds a tiny unreplicated subset -> default **Reject/Hold**; request owner decision only if there is a substantive new clinical implication.
- Dramatic performance jump from a multi-model agent orchestrator -> benchmark/system capability; do not attribute to a bare foundation model. Milestone only with separate rationale and owner authorization.

## Historical verification agent
Read `docs/HISTORICAL_EVIDENCE_AUDIT_2026-10-25.md` and its open checklist. Work in batches **grouped by unique original source/cohort**, not by each duplicated card. For each batch record audited IDs, original URL, exact Methods and Results locator, method classification, score check and discrepancies, test/clinical setting, remaining questions, audit date and reviewer; mark `reviewed` only for specifically source-checked cards. Post proposed patches in a PR, avoid changing frontier or public milestones without owner approval. Escalate conflicting evidence instead of choosing the more optimistic interpretation.


## Owner decision 26 October 2026 - HealthBench Professional grader separation

Main series healthbench_pro_2026: 525 tasks, 0-100 length-adjusted rubric points, grader GPT-5.4-low. Main-line eligibility stays strictly confirmed + same_protocol + checked primary locator, review and dates. Core and Professional never connect. Store rawValue separately from length-adjusted value, never as a comparable second point.

Retain source-checked vendor results with other graders as reported + different_protocol and show a visibly separate dashed side line with "Different grader, not directly comparable". Compute a separate running maximum only within the exact grader + metric + sufficiently aligned harness comparisonGroup. Never bridge graders; a singleton remains an isolated point. This side line never changes main-line eligibility, headline result or physician reference 43.7.

Every card, tooltip and Data table names the grader and original page/table/figure. A source-checked result with an unestablished grader remains reported + qualified as an unconnected point. A citation of the benchmark paper does not prove the run used GPT-5.4-low. Promotion requires explicit run-specific grader/protocol evidence. Unknown dates, effort and sample counts stay explicit. These are vendor reports, not independent clinical validation.

Owner authorizes seven specified records for cross-laboratory coverage. healthbenchprofessional.com is a discovery hint only, never a source, entry or news. Opus 4.7 51.9 uses Sonnet 4.6 (Opus 4.8 card pp. 228-229), so it cannot join the Opus-4.8 grader group. Fable/Mythos Table 8.1.A spans pp. 252-253; the score row is p. 253 and grader methods pp. 299-300.
