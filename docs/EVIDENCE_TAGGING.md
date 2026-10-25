# Evidence classification and milestone tagging
Version: 1.0 · 2026-10-25 · Canonical policy for all AI editors

## Read order and single source of truth
Every research, validation, data-entry, dashboard and publishing agent MUST read `AGENTS.md`, this document, `MONITOR_STANDARD.md` and `docs/data-entry-guide.md` BEFORE adding or changing studies, chart observations, historical events, milestones or evidence-backed news.
The portable facts live in `data/monitor-data.json`: `meta.evidenceTaxonomy` owns the machine-readable controlled vocabulary; `editorialCards[cardId].classification` owns per-item classification. `data/news.json` remains the independently approved social/editorial feed; a news item MAY reference a source-backed card by `linkedCardId` but MUST NOT make up an evidence status for commentary. Keep no second classification registry.
Use stable machine values in JSON, not localized labels. The UI, export, Data tables, cards, milestone filters and Glossary all read the same classification. Keep existing free-form `tags` for specific test descriptions; they are NOT replacements for the standardized classification.

## Two axes plus milestone - never flatten into one ladder
1. `topic` (exactly one): `capability` (benchmarks/model performance), `clinical_evidence` (clinical validation/test of a tool, including experimental clinical studies), `real_world_use` (documented routine clinical implementation), `discovery` (scientific/biomedical discovery), `context` (background events outside these four areas), or `unclassified` (not assessed). Topic expresses what the item is ABOUT, not how mature or credible it is.
2. `testSetting` (exactly one): `exam_or_vignette`, `simulated_workflow`, `standardized_patient`, `retrospective_records`, `prospective_patients`, `routine_care`, `preclinical`, `laboratory`, `non_clinical`, `unknown`. This describes what was tested, not the source's prestige.
3. `studyDesign` (exactly one): `benchmark`, `retrospective_evaluation`, `retrospective_simulation`, `prospective_single_arm`, `prospective_observational`, `randomized_simulation`, `randomized_clinical_trial`, `real_world_observational`, `case_report`, `historical_event`, `other`, `unknown`. This describes protocol and presence of a control group, independent of setting.
4. `milestone` is an independently curated boolean flag, not a fifth topic or automatically assigned to every paper, high score, study or chart milestone tile.
5. `realPatientTested` and `patientOutcomeEvidence` are tri-state booleans (`true`, `false`, `null`). `null` means not established; never treat unknown as no. Patient interactions alone do NOT establish improved clinical outcomes.
6. `classificationStatus`: `reviewed` only if the primary study's methods have been checked specifically for these attributes; otherwise `provisional`. This is separate from `validation.status` of the score claim.

## Critical decision rules
- Exam-style questions, constructed case vignettes, published NEJM teaching cases and model-graded clinician-chat prompts are NOT real-patient clinical trials, even if authored by clinicians, peer-reviewed or originally motivated by real cases. Set `realPatientTested=false` when confirmed by the methods.
- Simulated EHR tasks remain `simulated_workflow` even if they replay retrospective MIMIC records; choose `retrospective_simulation` and note the actual record origin in the card's setup. DO NOT upgrade a replay to `prospective_patients`.
- Standardized patients / paid actors are `standardized_patient`, not actual prospective patient care. Randomization of vignettes or actor conversations is `randomized_simulation`, not `randomized_clinical_trial`.
- A real prospective study with patients but no control arm is `prospective_single_arm`, not a controlled trial. A clinical RCT requires real patients, prospectively assigned interventions and a relevant clinical comparator.
- A case report/case series is NOT a benchmark; `case_report` describes its design, not high-grade validation. Case studies of real patients must be distinguished from case-based benchmark questions.
- `routine_care` requires independently documented use in ordinary delivery of care, not a product launch, regulatory approval, pilot, announced deployment or press release. Routine deployment alone does NOT prove outcomes.
- `preclinical` includes animal experiments; `laboratory` includes protein predictions/experimental reference structures, not human-patient trials. Non-medical history should use `context` + `non_clinical`.
- Mixed evidence: classify the precise result being quoted, not the strongest study elsewhere in the paper. If no single setting represents it fairly, split independent results into cards or set `unknown` and describe the mixed setup. Do not automatically upgrade `clinical_evidence` from a publication label.
- Journal peer-review, verified numbers, method comparability, clinical testing and patient-benefit evidence are FIVE different properties. Never conflate them.
- A milestone requires a clear, historically meaningful change in capability, clinical evidence, real-world adoption or discovery; cite the original evidence and record why it is exceptional. It can be `exam_or_vignette` with `realPatientTested=false`. Flagging a Microsoft case benchmark as milestone DOES NOT make it clinically validated.
- Ambiguous methodology: use `unknown` / `null` and `provisional`, document an explicit follow-up in TODO. Never classify by marketing text or journal title alone.

## Required workflow for agents
1. Open and examine the primary source's Methods (patient cohort, simulated actors, case origin, timing, comparator, endpoints) and mark source-specific unknowns.
2. Reuse the current `cardId` or create ONE new editorial card. Add the `classification` object with all seven keys. Do not duplicate items between chart/frontier, studies and milestones.
3. Distinguish sample size / denominator, real-patient interactions, prospective enrollment, randomization, actual clinical endpoint and regulatory status. Write the relevant limitations visibly.
4. Set `classificationStatus` accurately. For uncertain histories, `provisional` is fine; do not silently infer.
5. Set `milestone=true` only with an explicit editorial rationale and owner authorization; otherwise default false. This flag does not change benchmark eligibility.
6. When an approved news post is genuinely about this study, link it via `linkedCardId`; generic commentary remains unclassified and must not be mislabeled as a clinical study.
7. Confirm consistent values in point cards, Data table, milestone list, Glossary, JSON export and translations. Never modify original scores or historical evidence-review dates because of taxonomy maintenance.
8. Run `node scripts/sync-monitor-docs.mjs`, `node scripts/sync-monitor-docs.mjs --check`, `npm test`, `npm run typecheck`, `npm run build` and publication path/browser checks where possible. Record checked vs unchecked steps and changed files in `docs/implementation-status.md`.

## Two instructive examples
**Microsoft MAI-DxO**: topic=`capability`, testSetting=`exam_or_vignette`, studyDesign=`benchmark`, realPatientTested=false, patientOutcomeEvidence=false, milestone=true. It used published complex NEJM diagnostic cases in a simulated sequential workup, not prospective diagnosis of current patients. The 304 AI cases and 56-case physician subset must not be conflated. Milestone denotes methodological/capability significance, not clinical validation.

**AMIE before the appointment (Lancet 2026)**: topic=`clinical_evidence`, testSetting=`prospective_patients`, studyDesign=`prospective_single_arm`, realPatientTested=true, patientOutcomeEvidence=false, milestone=false unless separately editorially approved. 114 enrolled, 98 completed visits; physician survey endpoints concern 44 reviewed cases (33 helpful, 25 possibly changed approach); supervised feasibility, no control arm and no demonstrated improved patient outcomes.

## UI expectations
Expose a compact Topic + Test setting label on evidence cards and milestone entries; where useful show design, real-patient testing and explicit caveat. The Data table shows the same canonical setting/design per measurement, not guesses derived from track name. Glossary explains each term with both English and German copy. Topic/setting filters apply only to the items they state they filter; a taxonomy change MUST NOT alter an independently measured benchmark frontier or silently hide original research data.
