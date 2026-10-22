# AI in Medicine - Design & Interaction
Version: 1.0 | Date: 2026-10-18

## Product idea
A glanceable medical AI progress radar for presentations, mobile screens, physicians, industry and a broad audience. First impression: progress over calendar time. Second glance: what does it actually mean? Third level: evidence.

## Information hierarchy
1. Header: AI in Medicine, concise one-line explanation, visible 'Last reviewed' date.
2. Three aligned timeline charts (same x-axis: Jan 2022 through current reviewed month): Medical Knowledge; Clinical Assistance; Autonomous Workflows.
3. Each lower track uses one compact canvas. A short measurement question stays visible beneath the title. Test names and metric, one source-linked result, a compact line/dot legend and the main limitation remain visible below the plot; detailed methodology stays in point cards.
4. A point card on hover, tap or keyboard focus. Deeper source links available from the card.
5. Optional 'Method & sources' panel, kept away from the first-glance view.

## Chart mapping
- Main: strong, readable line for the best *eligible* performance achieved up to each date, **per comparable benchmark series**. Secondary points: small, muted dots for other evaluated models.
- For benchmark changes, present visibly distinct sub-series (different line style/label), no direct bridge.
- Retrospective points: hollow marker and brief legend ('Older models evaluated later').
- No invented intermediate observations, smoothed extrapolation or predictive line.
- Each lower track has one shared calendar plot. Series with the same metric unit have independent, labeled frontiers and distinct line/marker styling. Never bridge benchmarks or treat their vertical differences as direct performance comparisons; show that warning directly beneath the plot. If future metrics use different units, use an explicit benchmark selector rather than a shared y-axis.
- Y-axis label explicitly says Accuracy (%) or Rubric score (points) or Task success (%). Do not call every number 'percent'.
- Horizontal baseline only when test protocol supports it; benchmark context baselines use different styling with an explanation.
- Highlight meaningful real milestones, not every press release.

## Point detail card - editorial schema 2.0
All benchmark, milestone, history and study cards resolve their stable `cardId` through `editorialCards` in the central JSON. No generated fallback prose.

- Header: semantic evidence pill (publication type and version year), explicit 44px close control, serif title. Subtitle uses `tags.filter(Boolean).join(' · ')`.
- Key finding: highlighted warm surface with a gold 2px accent; bold quantitative result or hard documented comparison plus one sentence of meaning. Conceptual historical events must state a documented outcome, never invented performance.
- SETUP & COHORT: concise sample, design, prompting/tools and grading facts. No journal citation here.
- LIMITATIONS & VALIDITY: actual methodological bottlenecks and visible per-claim status/comparability. A checked score does not establish real-world safety or calendar dates.
- Footer: original paper title link, followed by its journal/report citation exactly once. Locators are attached to the source link. No redundant Source heading or Q&A headings.
- `timeline_year` identifies the cited evidence version; `evidence_date` and `journal_citation` are distinct. Lower chart x-position remains a visibly provisional model-availability proxy, not the journal year. Never backdate an expanded final paper's findings into the preprint year.
- Active points/milestones remain highlighted while the card is open. Desktop hover previews and mobile/keyboard dialogs use identical evidence content. Unknown timeline dates stay in a separate accessible list rather than being invented.

## Interaction & accessibility
- Desktop: hover reveals card; click pins it for source clicking. Mouse leave does not instantly hide an interactive pinned card.
- Mobile/tablet: tapping a point opens a bottom sheet or compact anchored card; close explicitly; do not require hover.
- Keyboard: Tab/focus and Enter/Space open; Escape closes; visible focus ring; links reachable.
- Touch targets at least 44px; charts and cards fit 320px wide screens; no horizontal page scrolling.
- Screen readers receive a point label with model, benchmark, value, date and status. Never encode differences by color alone.
- Header and axes need strong contrast. Motion subtle; support reduced-motion preference.

## Editorial copy example
Chart title: **Autonomous Workflows**
Question: 'Can AI complete medical tasks on its own?'
Explanation: 'Scores show success on simulated multi-step tasks, not permission to treat patients autonomously.'
Point card: 'Claude 3.5 Sonnet v2 - 69.7% on Stanford MedAgentBench (published 2025). Tested 300 simulated health-record tasks. This is task completion in a benchmark, not patient outcomes.'

## Export use
The same data + explanation fields should be reused in website hover cards, slides, speaker notes and social-media visualizations. No copy/paste data forks. Use the JSON as the single content source; presentation-specific layouts may be generated from it.

## Bilingual navigation - 18 October 2026

Keep the English brand name in both languages. EN/DE changes UI labels, axes and evidence explanations, persists locally and can be shared with the lang query parameter. Language selection must preserve cutoff, model, chart position and open card. Bibliographic titles, model names, metrics and primary facts remain unchanged in the central JSON.

The compact header includes a language switch and hamburger navigation. The menu provides Feedback, LinkedIn/Substack/Bluesky icon links and the compact label "articles on substack" (translated in German). The Bluesky icon and introduction contact link use the owner-supplied profile https://bsky.app/profile/gillespe.bsky.social. Feedback opens a user-controlled email draft; it does not transmit automatically. Menu dismissal works via Escape and outside click. Preserve 320px layout and keyboard access.

<!-- monitor-data-contract:start -->
## Generated data contract

This section is generated from `data/monitor-data.json`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.

- Schema: 1.1
- SHA-256 (parsed JSON): `bc4eabb353990b8775ef8e127d6dc1ec63558798e143d4e0b22920a546c57a4c`
- Tracks / benchmark series / measurements: 3 / 6 / 44
- Score validation: 38 confirmed, 1 reported, 5 under review
- Main-line eligible scores: 31; original-link gaps: 2
- Chronology: 44 unknown evaluation dates; 40 month-precision release proxies
- Last evidence review: 2026-10-22; last data change: 2026-10-22
- Calendar positioning uses model availability proxies, not evaluation dates. Confirmed scores do not validate release-month chronology or source-publication dates and versions.
- Frontier must be recalculated separately within each benchmark series. Pending and qualified-only records do not form a confirmed main line.
- Source policy: MONITOR_STANDARD.md; interface: DESIGN.md; collaboration: AGENTS.md.

Run `node scripts/sync-monitor-docs.mjs` after a JSON change, and `node scripts/sync-monitor-docs.mjs --check` before release. Structural checks do not constitute independent scientific validation or live URL verification.
<!-- monitor-data-contract:end -->

## Simple published reading view - 18 October 2026
The top row contains the title and menu only; presentation/language live inside the menu. No chart copy/image controls, benchmark result accordions, review queues or back-to-charts links in the reading view. Only source-confirmed benchmark records appear; unconfirmed candidates remain in the portable dataset. Sources, setup and limitations are reached through point cards. Each lower track has a single plot and one optional Both/benchmark selector. Milestone buttons sit above the plot. Same-point multiple results switch inside one card. Small overview markers do not display count bubbles.

The Milestones details element and its first-child timeline controls remain stable DOM nodes during cutoff/model/view changes; the slider must not lose focus or close the disclosure. The other open study disclosure also remains open. Published point values and benchmark eligibility remain data driven; sparse or incomparable data do not gain fabricated lines.

## Introduction - updated 22 October 2026
The owner-approved introduction is expanded on initial load. Its native disclosure shows only the triangle, with an accessible Introduction label; no visible About this monitor heading. When collapsed, the triangle aligns inline with the 'Last reviewed' line (`#editorial-check`) with no empty blank row beneath it. Every monitor update must keep the visible 'Last reviewed' date current (`meta.lastReviewedAt` + `node scripts/sync-monitor-docs.mjs`). Preserve the approved visitor-focused English copy verbatim: a bold opening question, a paragraph explaining the three tracks and their practical value, then a separate invitation to share studies, questions or perspectives. Each has an equivalent German translation. The triangle remains keyboard operable and has a 44px touch target.

AlphaFold has no separate highlight buttons beneath the overview heading. CASP announcements and paper milestones remain accessible in the shared Milestones disclosure and existing timeline anchors. Do not duplicate the same source as an additional milestone.

## Visible chart context - 18 October 2026
Each lower chart shows its plain-language measurement question, active benchmark descriptions and metric, one selected source-linked result, a compact line/dot legend and its main limitation. The portable track/series readingGuide fields supply this copy. Result and comparator derive from the same selected series, publication cutoff and model selection; only eligible same-protocol points may be compared. In the Both view, highlight one result from the most recent nonempty benchmark series without comparing across benchmarks. Confirmed qualified scores can be shown as selected observations, with no implied trend or comparator. Different-test warnings and unknown comparability remain visible. No new accordions or second plot. Keep mobile text readable and the per-track layout compact.

Every visible lower-chart marker supports a mouse hover card and pinning by click, including markers near grouped touch targets. Nearby touch targets keep a result switcher; hover resolves the closest member. Desktop groups use the actual chart coordinate scale rather than forcing mobile-sized clustering. Marker keyboard activation and touch cards remain available.

## Related resources - 22 October 2026
Place a quiet, unboxed Related row directly below the three chart thumbnails. Links use descriptive titles, publisher credit and an external arrow, open in a new tab with noopener noreferrer, and wrap on narrow screens. Maintain a 44px link target. Related URLs and translated labels live in the portable JSON under extensions.navigation.relatedLinks and extensions.locales. These are external reading resources, not benchmark observations.

## Interesting news - 22 October 2026
The introduction's news section shows Interesting news in place of Changes: the four newest individually approved stories and an All link to `/news/`. The archive uses the same `data/news.json` store and retains every approved story. Sort by the original publication date, newest first, and keep cross-posts together under the original story's date. Put small named platform links with icons beneath each story; the compact preview shows its primary source, while the archive shows all linked platforms. Every Substack story carries a visible gold star with an accessible label. Language selection works in the dashboard and archive and is preserved by All and the back link. Never add a story without the user's individual approval. Adding approved records updates both views on the next publication; no automatic import or publication is enabled. The evidence review date remains beneath the introduction and is unrelated to news dates.

## Editorial visual polish & typography - 22 October 2026
- **Typography & numeric rhythm**: Load `Newsreader` (serif headings) and `Inter` (UI, body and charts) with graceful fallbacks. Enforce `font-variant-numeric: tabular-nums` across SVG axes, dates, scores, selectors and key-finding metrics so numbers align vertically without jitter.
- **Chart depth & epistemic clarity**: Render a subtle vertical linear-gradient fill (`opacity <= 0.13` to `0`) strictly beneath eligible step-frontier segments (`monitor-frontier-area`)—never beneath non-eligible points or across incompatible series. In the 1950–2030 overview chart, distinguish the post-cutoff future zone (`2026–2030`) with a subtle diagonal SVG hatch pattern (`#future-hatch`) so scenario projections are visually unmistakable from historical anchors.
- **Surface tokens & track cues**: Use warm paper surfaces (`--paper`, `--surface`, `--surface-muted`), subtle borders (`--line`, `--line-strong`) and layered elevation (`--shadow-sm`, `--shadow-md`, `--shadow-lg`). Reinforce track identity (`--track`) through top accent borders on chart thumbnails and track sections, color-coded dot indicators in track headings, and left-accented cards for milestone pills (`.chart-stories`) and selected findings (`.track-result-link`). Keep every track below 620px in vertical height and preserve 320px viewport fit without horizontal overflow.
