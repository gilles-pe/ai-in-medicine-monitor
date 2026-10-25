# Open work

The original phase 3 acceptance remains partly open. Current feature behavior is specified in FUNCTIONALITY.md; each run is recorded in docs/implementation-status.md. Historical backlog: docs/TODO.md.

## 25 October 2026 - current repair and owner requests

- [x] Verify production JavaScript boot; restore cards, grouped sample selection, menu and chart zoom.
- [x] Verify touch-sized overview source taps, desktop hover, source-card links, keyboard and gesture separation.
- [x] Verify all four full-view controls, exit routes, 44px targets and focus restoration.
- [x] Glossary and all Sources initially closed; triangle disclosures retain user-opened state during updates.
- [x] Practical question always visible; introduction beneath initially open; Gilles Penning masthead with Tracking what AI can do in medicine. tagline; roles in portrait area.
- [x] Link current feature/design/data-entry/change-log docs from AGENTS; include both JSON stores and docs in portable export.
- [x] Replace GP monogram with the owner-supplied portrait in the profile and About page; accurate alt text and cache-busted asset URL.
- [x] Add the authorized AMIE previsit study, source, milestone, card and news with the verified Bluesky thread. Correct denominators: 33/44 and 25/44; 98 completed visits. Keep outside benchmark frontiers.
- [ ] Add AMIE LinkedIn/Substack cross-post links only when their exact published URLs are verified; profiles and older articles are not substitutes.


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
- `/datenschutz/` is a placeholder (“Content follows”) with `noindex` and is excluded from the sitemap. Legal text is not written.
- [ ] Backfill explicit category/originalLanguage for the four older news entries after checking their originals. New AMIE entry has verified post/de metadata; older records keep the documented compatibility fallback.
- [x] Translate dynamic takeaways as complete sentences before restoring abbreviation markup; preserve values, model names, dates and EN/DE round trips.
- [x] Retain the assistance key number from the eligible same-protocol result (GPT-5.4 (Base), 48.1 points); other protocols remain separate.

## Verification status

Repair f926a6ba passed 68 unit tests, typecheck, build/path checks and 35 production desktop/touch browser tests (three intentional device-specific skips). Its GitHub Pages deployment succeeded; live cards and grouped switching were checked at gillespenning.com. Final source 1fa83e9b passed 75 unit tests, typecheck, build/path checks and 39 production desktop/touch browser cases (three intentional device-specific skips). GitHub Pages run 40141452498 deployed successfully. The public header, AI tagline, portrait asset and AMIE milestone were verified live. Full Lighthouse and numerical contrast targets have not been certified.

## Copy audit - 25 October 2026

- [x] Correct AI capability question in EN/DE; retain personal I only in owner copy.
- [x] Repair sentence fragments, awkward invitations, untranslated profile/card caveats and category/language concatenation.
- [x] Preserve benchmark records, original sources and evidence-review dates; synchronize policy/document hashes.
