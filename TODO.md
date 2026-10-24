# Open work

The original phase 3 acceptance remains partly open. Current feature behavior is specified in FUNCTIONALITY.md; each run is recorded in docs/implementation-status.md. Historical backlog: docs/TODO.md.

## 25 October 2026 - current repair and owner requests

- [ ] Verify production JavaScript boot; restore cards, grouped sample selection, menu and chart zoom.
- [ ] Verify touch-sized overview source taps, desktop hover, source-card links, keyboard and gesture separation.
- [ ] Verify all four full-view controls, exit routes, 44px targets and focus restoration.
- [ ] Glossary and all Sources initially closed; triangle disclosures retain user-opened state during updates.
- [ ] Practical question always visible; introduction beneath initially open; Still pending masthead/tagline; roles in portrait area.
- [ ] Link current feature/design/data-entry/change-log docs from AGENTS; include both JSON stores and docs in portable export.
- [ ] Replace GP monogram with an owner-supplied portrait; no image was supplied in this request.
- [ ] Add the explicitly authorized new AMIE patient-consultation study/news and verified social links in a separate evidence/content update; do not invent source URLs or mix its outcomes into an incompatible benchmark.


## Phase 3 — accessibility and responsive quality

- Keyboard operation for accordions, dropdowns, chips, and the menu, with a visible focus style.
- Focus trap and Esc in the menu.
- Contrast at least 4.5:1.
- ARIA labels where the control’s name is not already visible.
- `prefers-reduced-motion` for motion that is not already covered.
- Responsive check at 375px, 768px, and 1280px: no horizontal scroll, tap targets at least 44px, track height under 620px.
- Playwright tests for those checks.
- Final Lighthouse, mobile and desktop. Targets: Performance >= 90, Accessibility >= 95, SEO 100, LCP < 2.5s, CLS < 0.1.

## Left from Phases 1–2

- Mobile Lighthouse performance is not yet >= 90, and mobile LCP is not yet < 2.5s. Do not treat the Phase 1–2 scores as meeting the original target.
- Replace `assets/img/gilles-penning.jpg` with the owner’s portrait. The committed file is a square “GP” monogram placeholder. Until replaced, its alt text must identify it as a GP monogram placeholder.
- `/datenschutz/` is a placeholder (“Content follows”) with `noindex` and is excluded from the sitemap. Legal text is not written.
- News categories are not in `data/news.json`. Cards use Article when a story has a Substack source, otherwise Post. Original language is DE when the English and German titles are the same German headline, otherwise EN.
- New takeaway sentences are not translated in the German interface, because abbreviation markup splits the sentence.
- The assistance key number is the eligible same-protocol result (GPT-5.4 (Base) at 48.1 points), not a higher score from a different protocol.
