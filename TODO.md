# Open work

The original phase 3 acceptance remains partly open. Current feature behavior is specified in FUNCTIONALITY.md; each run is recorded in docs/implementation-status.md. Historical backlog: docs/TODO.md.

## 25 October 2026 - current repair and owner requests

- [x] Verify production JavaScript boot; restore cards, grouped sample selection, menu and chart zoom.
- [x] Verify touch-sized overview source taps, desktop hover, source-card links, keyboard and gesture separation.
- [x] Verify all four full-view controls, exit routes, 44px targets and focus restoration.
- [x] Glossary and all Sources initially closed; triangle disclosures retain user-opened state during updates.
- [x] Practical question always visible; introduction open on desktop and closed on mobile; Gilles Penning masthead with Tracking what AI can do in medicine. tagline; roles in portrait area.
- [x] Link current feature/design/data-entry/change-log docs from AGENTS; include both JSON stores and docs in portable export.
- [x] Replace GP monogram with the owner-supplied portrait in the profile and About page; accurate alt text and cache-busted asset URL.
- [x] Add the authorized AMIE previsit study, source, milestone, card and news with the verified Bluesky thread. Correct denominators: 33/44 and 25/44; 98 completed visits. Keep outside benchmark frontiers.
- [x] Add Microsoft MAI-DxO (Science, 22 October 2026) as a Clinical Assistance milestone with original study link, 83.2% on 304 simulated cases, 36.1% generalist comparator on 56 cases, and explicit clinical limitations. No new benchmark frontier point or other studies.
- [ ] Add the AMIE Substack cross-post link when its exact published URL is verified; Substack was unavailable on 25 October. The exact LinkedIn post and Bluesky thread are verified and included; profiles and older articles are not substitutes.


## Phase 3 — accessibility and responsive quality

- [x] Keyboard operation for current disclosures, selectors, point cards, menu and zoom, with visible focus styling; production browser coverage.
- [x] Focus containment and Esc in the menu and expanded charts.
- [ ] Complete a measured contrast audit (at least 4.5:1 for normal text).
- [x] Accessible names/states for tested icon controls, source selection and chart zoom.
- [x] Global `prefers-reduced-motion` disables smooth scrolling, animations and transitions.
- [x] Responsive production checks at 320/375/768/1280px: no horizontal overflow; lower point targets and zoom controls at least 44px; lower track height under 620px.
- [ ] Audit every remaining navigation/text-link target against touch accessibility requirements.
- [x] Production-artifact Playwright tests for interaction, touch, keyboard and responsive acceptance.
- [ ] Final Lighthouse, mobile and desktop. Targets: Performance >= 90, Accessibility >= 95, SEO 100, LCP < 2.5s, CLS < 0.1.

## Left from Phases 1–2

- Mobile Lighthouse performance is not yet >= 90, and mobile LCP is not yet < 2.5s. Do not treat the Phase 1–2 scores as meeting the original target.
- [x] Owner portrait supplied and installed at `assets/img/gilles-penning.jpg`; original square JPEG preserved.
- [x] Replace the privacy placeholder with an English/German notice reflecting actual hosting, local language storage, external images and links; retain noindex.
- [ ] Backfill explicit category/originalLanguage for the four older news entries after checking their originals. New AMIE entry has verified post/en metadata; older records keep the documented compatibility fallback.
- [x] Translate dynamic takeaways as complete sentences before restoring abbreviation markup; preserve values, model names, dates and EN/DE round trips.
- [x] Retain the assistance key number from the eligible same-protocol result (GPT-5.4 (Base), 48.1 points); other protocols remain separate.

## Verification status

Repair f926a6ba passed 68 unit tests, typecheck, build/path checks and 35 production desktop/touch browser tests (three intentional device-specific skips). Its GitHub Pages deployment succeeded; live cards and grouped switching were checked at gillespenning.com. Final source 1fa83e9b passed 75 unit tests, typecheck, build/path checks and 39 production desktop/touch browser cases (three intentional device-specific skips). GitHub Pages run 40141452498 deployed successfully. The public header, AI tagline, portrait asset and AMIE milestone were verified live. Full Lighthouse and numerical contrast targets have not been certified.

## Copy audit - 25 October 2026

- [x] Correct AI capability question in EN/DE; retain personal I only in owner copy.
- [x] Repair sentence fragments, awkward invitations, untranslated profile/card caveats and category/language concatenation.
- [x] Preserve benchmark records, original sources and evidence-review dates; synchronize policy/document hashes.

## Chronological archive - 25 October 2026

- [x] Compact faded intro/news, consistent headings, thumbnails and metadata/source rows.
- [x] Shared header/menu on dashboard, archive, About and legal pages.
- [x] Remove redundant bottom indexes; preserve chart cards and timeline controls.
- [x] Import 20 distinct verified stories and document research coverage.
- [ ] Complete missing Substack/LinkedIn/X archive from accessible original links or publication export; see docs/NEWS_COVERAGE.md.

## Responsive density — 25 October 2026

- [x] Desktop intro open; mobile closed, with native manual toggle.
- [x] Mobile thumbnails inside expanded news; desktop image and text share a clipped fade.
- [x] Capitalized News and track titles; chart title and current benchmark value on one row.
- [x] Remove the separate Milestones bar and benchmark selectors; keep independent series and move timeline controls to the burger menu.
- [x] Smaller Glossary and factual bilingual privacy notice.
- [ ] Add a human reference only when a directly comparable primary-source result is validated; current assistance dataset has none.

- [x] Place milestone tiles below each lower chart, followed by a closed native Data table disclosure; question and answer follow immediately.

Release verification for the responsive-density/table-order update: source 5ec865c passed 75 unit tests, TypeScript, document/build/path checks and 45 production desktop/touch cases (3 intentional skips). Pages run 40181288607 deployed successfully; live HTML and bilingual privacy content checked. Remaining archive, contrast, Lighthouse and human-baseline research tasks stay open.

25 October 2026 - latest owner correction: benchmark value sits immediately beside its chart title; review date sits small below the hamburger button. Menu uses About Me, icon-only social links including X, and a bottom row with Feedback left and language right. Presentation controls/behavior, menu News link, timeline playback/date/model controls removed. Historical share URL cutoff remains supported. X profile URL is not verified; its icon currently links to the X homepage. This supersedes earlier timeline/presentation/menu requirements. Release checks pending.

25 October 2026 - chart windows and image export: all four charts offer All time / 5Y / 2Y / 1Y / 6M controls below their plots; chosen windows survive full-view and resize. Axes show actual units and adapt with padding to the visible observations; zero remains when appropriate. The overview remains illustrative and all-time retains the 1950–2030 scenarios. Full-view charts offer PNG export with repeated low-contrast ai.gillespenning.com credits rasterized inside the plot, retaining title/date/evidence caveats. Image attribution discourages cropping but is not tamper-proof. News filters removed; owner-confirmed X profile installed. Three authorized Substack Notes are retained in data/news.json coverage.requestedNotes pending verifiable original text/date; see docs/NEWS_COVERAGE.md. No study scores or scientific review date changed. Release checks pending.


## Evidence classification - 25 October 2026
- [x] Create canonical docs/EVIDENCE_TAGGING.md, reference from AGENTS and content-entry instructions.
- [x] Attach standard topic, test setting, study design, real-patient flag, patient outcome flag and milestone to all existing editorial cards.
- [x] Expose the distinction in evidence cards, news linked to studies, milestone filters, chart Data tables and bilingual Glossary.
- [x] Reject invalid setting/clinical-test combinations in validator and unit tests.
- [ ] Independently re-check the primary Methods for provisional historical classifications (especially case origin, retrospective versus prospective setting and real-patient outcomes). Keep tentative labels explicitly provisional until examined.


## 25 October 2026 - source-audited historical evidence and intake gates
- [x] Add mandatory evidence quality + material editorial impact gates at docs/MEASUREMENT_INTAKE.md, linked early in AGENTS.md and in data-entry/evidence rules.
- [x] Add independent historical audit ledger and verify the original Methods / cited values for six unique study sources, 11 linked cards (without changing benchmark scores, comparability or timeline).
- [x] Include audit and intake specifications in portable ZIP export and GitHub Pages build.
- [ ] Historical source audit, follow-up: remaining provisional classification cards, prioritize clinical study and numeric benchmark series; group by original cohort/DOI and avoid counting duplicate representations as separate validation.
- [x] Owner approved and implemented distinct `clinician_chat_benchmark` testSetting for HealthBench Professional (18 evidence cards); maintain separate HealthBench Core evaluation series and unchanged source-validation statuses.
- [ ] Independently reassess whether `exam_or_vignette` adequately describes HealthBench Core's mostly synthetic general health conversations; do not infer that its examples are exclusively physician chats.
- [ ] Independent evidence audit of source-restricted papers and clinical patient outcome claims; no inferred upgrade from source title or PR.

## 26 October 2026 - HealthBench Professional

- [x] Check seven system-card records, separate raw/adjusted scores and exact graders.
- [x] Preserve main line, paper Opus 4.7 47.0 and physician reference 43.7.
- [ ] Obtain explicit run-specific GPT-5.4-low evidence, effort and sample count for Astra/Sol before promotion.

## 26 October - export credit and sparse windows

- [x] Append | ai.gillespenning.com to the PNG brand footer.
- [ ] Consider a taller full-view plot and a sparse-measurement hint for short windows; preserve actual slopes, benchmark protocols and gaps. Proposal only; no artificial padding change made.

- [x] Preserve the entering best value when clipping an existing frontier connection to a short time window; keep real dots and gaps unchanged.

27 October 2026 - owner request: the full Chronological News archive shows each existing story summary, thumbnail and source links permanently, using plain content instead of details/summary. There is no collapse control in either language; homepage previews retain their compact disclosures. Shared upper social navigation adds a normal Substack profile link (https://substack.com/@medtechsignal) immediately before LinkedIn and Bluesky, independent of Subscribe. News text, original dates and evidence remain unchanged. Checks/publication pending.

## 31 October 2026 - publishing follow-up

- [x] Add the owner-approved diagnosis commentary to the shared homepage/News feed with Substack, LinkedIn and X cross-posts.
- [ ] Add its Bluesky cross-post only after publication and URL verification; no Bluesky post was published in this session.
