# HealthAgentBench v2 review - 2 November 2026

Decision: HOLD / needs_review for dashboard admission. No production change. Numeric verification passed; v1 and v2 demonstrably use different protocols. Candidate records live exclusively in data/monitor-data.json → extensions.researchAudit.healthAgentBenchV2Review.proposedSeries, outside published track series.

## Original sources and exact locations
- v2: https://arxiv.org/pdf/2606.31179v2 - revised 25 October 2026. Section 4.1, printed/PDF p. 10 gives exact totals; Figure 4 p. 11 rounds bar labels to integers. Table 4 p. 23 gives category percentages; Tables 2-3 p. 21 document counts and scoring.
- v1: https://arxiv.org/pdf/2606.31179v1 - 30 June 2026. Section 4.1 p. 10; Figure 4 p. 11; Tables 2-3 p. 21.
- Version-pinned original leaderboard: https://microsoft.github.io/HealthAgentBench/v1/ - the existing Opus 5 55% is present here. The June PDF does not contain this later Opus 5 baseline. Its imported July dates remain unverified.
- Current leaderboard: https://microsoft.github.io/HealthAgentBench/ - corroborates v2 results; PDF remains the numeric authority.

| v2 system | Successful tasks | Rate | Harness |
| --- | --- | --- | --- |
| Opus 5.5 | 43/75 | 57.3% | Claude Code |
| GPT-6 Astra | 38/75 | 50.7% | Codex |
| Sonnet 5.5 | 38/75 | 50.7% | Claude Code |
| Opus 5 (baseline) | 24/75 | 32.0% | Claude Code |

The additional two v2 baselines (GPT-6-sol 31/75 and GPT-5.6-sol 26/75) were inspected for context, not proposed for admission by this task.

## Gate A / comparison
v1 uses 54 tasks in 7 categories, each repeated three times (162 attempts/agent). v2 uses 75 tasks in 9 categories and one scored attempt/task (75/agent; 450 total across six agents). Trial matching and EHR format conversion are removed; MRI QA, pathology slide selection, compositional EHR QA and cancer survival prediction are added. The data-quality precision floor changes from 0.01 to 0.1 (Table 3, p. 21 in both PDFs). These changes are sufficient to reject same_protocol between versions.

Both are binary task-success benchmarks, with task-specific verifiers. Matching high-level metric, native harness family and xhigh reasoning does not establish identical task identities, scorer revisions or scaffold snapshots. v1 includes Copilot CLI as well as Codex and Claude Code; v2 uses the latter two families. No cross-version calibration or repeated-seed comparison was established.

Do not substitute v2 Opus 5 32.0% for the existing v1 leaderboard 55%. They are different evaluations. Likewise, 57.3% versus 55% is not an established 2.3-point improvement. A separately labelled v2 series is the appropriate eventual destination, never a bridge onto v1.

## Gate B / limits and pending admission
The expanded test and baseline rerun are informative; numerical rank alone is not clinical validation or evidence of practical deployment. These are offline agent tasks over medical records/images, with task-dependent pass criteria, not prospective autonomous care or patient-outcome trials. Wilson intervals are descriptive task-outcome intervals, not repeated-run robustness evidence.

All four candidates remain needs_review and non-public, with sourceScoreCheck=passed and comparability=different_protocol relative to the existing series. Model release/evaluation dates and exact harness versions remain null. Publication date is known but must not be reused as model availability. This review does not authorize a new same-protocol main line or silently change axis semantics. Preserve the published series and 55% headline until admission/chronology is resolved, following the owner's default not to publish uncertain integration.

## Reproducibility
Original PDFs were downloaded through normal HTTPS and locally extracted. v2 p. 10 was rendered and visually checked. No aggregators used. PDF SHA-256:
- v1: d4d77b0b3578d2ec7db612dbe8efdf507f89b3355308999871eb48e1ef124402
- v2: e5807b4fbca0c1bb0631737233d69ed62569b91ef1fc430aa438725d69eb6582

## Subsequent owner decision - 2 November 2026
The owner approved publishing the verified results separately after the hold rationale was discussed. This supersedes the admission hold above, not the protocol comparison. Public records now live in tracks[autonomous_workflows].series[healthagentbench_msft_2026_v2], as confirmed scores with different_protocol and no main-line eligibility. Known paper revision date positions isolated points and is explicitly labelled; modelReleaseDate/evaluationDate remain null. Best v2 result 57.3% is a version-specific headline, not a 2.3-point gain over v1. Harness snapshots remain a disclosed limitation. Historical v1 links are version-pinned; values unchanged.
