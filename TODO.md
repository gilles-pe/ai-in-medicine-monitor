# Open work

Phase 3 was not implemented. The items below are still open.

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
- Replace `assets/img/gilles-penning.jpg` with the owner’s portrait. The committed file is a square “GP” monogram placeholder. Alt text stays “Portrait of Gilles Penning”.
- `/datenschutz/` is a placeholder (“Content follows”) with `noindex` and is excluded from the sitemap. Legal text is not written.
- News categories are not in `data/news.json`. Cards use Article when a story has a Substack source, otherwise Post. Original language is DE when the English and German titles are the same German headline, otherwise EN.
- New takeaway sentences are not translated in the German interface, because abbreviation markup splits the sentence.
- The assistance key number is the eligible same-protocol result (GPT-5.4 (Base) at 48.1 points), not a higher score from a different protocol.
