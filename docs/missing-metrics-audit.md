# Missing metrics audit - 18 October 2026

Research only. No dashboard or central JSON changed.

Reviewed 24 records: 16 supported, 6 conflicting, 2 unresolved.

Supported means the number is in primary evidence; it does not automatically establish comparability or main-line eligibility. Conflicting rows have supported numbers but incorrect or unproven imported attribution, setup or date.

## Important corrections

- PubMedGPT 50.3 is a fine-tuned result, not zero-shot.
- GPT-4-base 86.1 is non-production; evidence first added 12 April 2023.
- Med-PaLM 2 86.5 uses a MedQA-only fine-tuned variant; unified ensemble refinement gives 85.4.
- GPT-4o 83.6, o1 95.7 and o3-mini 91.8 are in the Meerkat primary paper, published 2 May 2025, not the imported ReMedQA attribution. Exact commercial prompting remains unresolved.
- Original HealthBench Table7 supports all five imported means. These form a retrospective same-protocol comparison, not five independently dated evaluations.
- HealthBench Professional Figure4 supports seven imported values. Keep ChatGPT for Clinicians separate from base-model protocol.
- Corti 60.5 is found on the manufacturer website; independent reproduction and grader configuration remain unchecked.
- Two late Anthropic values remain unresolved. A secondary locator is a lead, not primary validation.

## Record-level evidence

| ID | Imported | Primary number | Status | Comparison | Source / locator |
|---|---:|---:|---|---|---|
| 1.0a | 50.3 | 50.3 | conflicting | qualified | https://crfm.stanford.edu/2022/12/15/biomedlm.html - Question Answering, results and hyperparameters tables |
| 1.1 | 67.6 | 67.6 | supported | qualified | https://arxiv.org/abs/2212.13138 - Abstract; best Flan-PaLM MedQA result |
| 1.1b | 86.1 | 86.1 | conflicting | qualified | https://arxiv.org/abs/2303.13375 - Table 5, GPT-4-base, US 4-option, 5-shot; see arxiv2305.09617v1 Table4 caption |
| 1.2 | 86.5 | 86.5 | conflicting | qualified | https://arxiv.org/html/2305.09617v1 - Table 4 and section 4.1 MedQA |
| 1.2b | 90.2 | 90.2 | supported | qualified | https://arxiv.org/abs/2311.16452 - Table 1, MedQA US 4-option; footnote ** |
| 1.3 | 91.1 | 91.1 | supported | qualified | https://arxiv.org/html/2404.18416v1 - Abstract and section 4.1 MedQA results |
| 1.4 | 83.6 | 83.6 | conflicting | unknown | https://www.nature.com/articles/s41746-025-01653-8 - Table 1 MedQA; Methods/Table3 n=1273 |
| 1.5 | 95.7 | 95.7 | conflicting | unknown | https://www.nature.com/articles/s41746-025-01653-8 - Table 1 MedQA; Methods/Table3 n=1273 |
| 1.6 | 91.8 | 91.8 | conflicting | unknown | https://www.nature.com/articles/s41746-025-01653-8 - Table 1 MedQA; Methods/Table3 n=1273 |
| 2.1 | 15.54 | 15.54 | supported | same_protocol | https://arxiv.org/html/2505.08775v1 - Table 7 mean column |
| 2.2 | 32.33 | 32.33 | supported | same_protocol | https://arxiv.org/html/2505.08775v1 - Table 7 mean column |
| 2.3 | 42 | 42.0 | supported | same_protocol | https://arxiv.org/html/2505.08775v1 - Table 7 mean column |
| 2.4 | 47.78 | 47.78 | supported | same_protocol | https://arxiv.org/html/2505.08775v1 - Table 7 mean column |
| 2.5 | 59.9 | 59.9 | supported | same_protocol | https://arxiv.org/html/2505.08775v1 - Table 7 mean column |
| 2.6 | 46.2 | 46.2 | supported | same_protocol | https://arxiv.org/html/2604.27470v1 - Figure 4 overall panel, printed bar labels; sections 4.1-4.3 |
| 2.7 | 45.9 | 45.9 | supported | same_protocol | https://arxiv.org/html/2604.27470v1 - Figure 4 overall panel, printed bar labels; sections 4.1-4.3 |
| 2.8 | 43.8 | 43.8 | supported | same_protocol | https://arxiv.org/html/2604.27470v1 - Figure 4 overall panel, printed bar labels; sections 4.1-4.3 |
| 2.9 | 36.1 | 36.1 | supported | same_protocol | https://arxiv.org/html/2604.27470v1 - Figure 4 overall panel, printed bar labels; sections 4.1-4.3 |
| 2.10 | 48.1 | 48.1 | supported | same_protocol | https://arxiv.org/html/2604.27470v1 - Figure 4 overall panel, printed bar labels; sections 4.1-4.3 |
| 2.11 | 47 | 47.0 | supported | same_protocol | https://arxiv.org/html/2604.27470v1 - Figure 4 overall panel, printed bar labels; sections 4.1-4.3 |
| 2.12 | 59 | 59.0 | supported | different_protocol | https://arxiv.org/html/2604.27470v1 - Figure 4 overall panel, printed bar labels; sections 4.1-4.3 |
| 2.13 | 60.5 | 60.5 | supported | unknown | https://www.corti.ai/benchmarks - HealthBench Professional overall score comparison |
| 2.14 | 56.9 | pending | unresolved | unknown | Original source not accessed - Candidate: Mythos/Fable system card Table8.1.A p252; PDF inaccessible |
| 2.15 | 66 | pending | unresolved | unknown | Original source not accessed - Candidate: Mythos/Fable system card Table8.1.A p252; PDF inaccessible |

## Follow-up

- Independently inspect original Anthropic system-card PDF, exact row and grader before confirming 2.14/2.15.
- Audit commercial prompting and dated API snapshots in Meerkat supplement/code.
- Review PubMedGPT fine-tuning and all MedQA prompt/tool differences before connecting a historical line.
- Correct GPT-4-base evidence publication to April12; public-model availability remains a separate unresolved field.
- Retrieve dated Corti report and exact grading configuration; keep supplier score reported.
- Audit all release dates separately; source publication is not evaluation time.
