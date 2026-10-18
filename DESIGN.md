# Digital Health & AI in Medicine - Design & Interaction
Version: 1.0 | Date: 2026-10-18

## Product idea
A glanceable medical AI progress radar for presentations, mobile screens, physicians, industry and a broad audience. First impression: progress over calendar time. Second glance: what does it actually mean? Third level: evidence.

## Information hierarchy
1. Header: Digital Health & AI in Medicine, concise one-line explanation, visible 'Last reviewed' date.
2. Three aligned timeline charts (same x-axis: Jan 2022 through current reviewed month): Medical Knowledge; Clinical Assistance; Autonomous Workflows.
3. Each chart has a **human question**, plain-language score definition, and small 'About this benchmark' affordance.
4. A point card on hover, tap or keyboard focus. Deeper source links available from the card.
5. Optional 'Method & sources' panel, kept away from the first-glance view.

## Chart mapping
- Main: strong, readable line for the best *eligible* performance achieved up to each date, **per comparable benchmark series**. Secondary points: small, muted dots for other evaluated models.
- For benchmark changes, present visibly distinct sub-series (different line style/label), no direct bridge.
- Retrospective points: hollow marker and brief legend ('Older models evaluated later').
- No invented intermediate observations, smoothed extrapolation or predictive line.
- When several series have incompatible metrics, label them separately, preferably as small separate bands or toggle within the track rather than share a deceptive common y-axis.
- Y-axis label explicitly says Accuracy (%) or Rubric score (points) or Task success (%). Do not call every number 'percent'.
- Horizontal baseline only when test protocol supports it; benchmark context baselines use different styling with an explanation.
- Highlight meaningful real milestones, not every press release.

## Point detail card - exact content contract
Compact top area: model/system + date; value + benchmark title; validation status.
Then these five user-facing items in this order:
1. **What was tested?** One sentence, e.g. '300 simulated tasks in an electronic patient record.'
2. **What does this value mean?** One sentence, e.g. 'Succeeded on 69.7% of those tasks in this test.'
3. **How was it tested?** Short indication of setup/tools and whether older model evaluated later.
4. **How sure are we?** Confirmed / Reported / Under review, and brief comparability qualifier.
5. **Source**: one or more tappable original links with readable labels, ideally specific table/page.
Optional: distinct 'Why it matters' one-liner and benchmark-specific caveat.

The card content comes from structured JSON (`explain`, `setup`, `validation`, `sources`), not invented or generated live on hover. When a field is absent, show 'Not yet checked', never invent.

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

The compact header includes a language switch and hamburger navigation. The menu provides Feedback, verified LinkedIn/Substack icon links and articles on Substack. A Bluesky icon remains inactive until its profile URL is verified. Feedback opens a user-controlled email draft; it does not transmit automatically. Menu dismissal works via Escape and outside click. Preserve 320px layout and keyboard access.

<!-- monitor-data-contract:start -->
## Generated data contract

This section is generated from `data/monitor-data.json`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.

- Schema: 1.0
- SHA-256 (parsed JSON): `e3c0f4d89f2ca6dcac5f058667bf5eac1c77e899721f11af4e791b867896f34e`
- Tracks / benchmark series / measurements: 3 / 5 / 41
- Score validation: 18 confirmed, 0 reported, 23 under review
- Main-line eligible scores: 17; original-link gaps: 22
- Chronology: 41 unknown evaluation dates; 41 month-precision release proxies
- Last evidence review: 2026-10-18; last data change: 2026-10-18
- Calendar positioning uses model availability proxies, not evaluation dates. Confirmed scores do not validate release-month chronology or source-publication dates and versions.
- Frontier must be recalculated separately within each benchmark series. Pending and qualified-only records do not form a confirmed main line.
- Source policy: MONITOR_STANDARD.md; interface: DESIGN.md; collaboration: AGENTS.md.

Run `node scripts/sync-monitor-docs.mjs` after a JSON change, and `node scripts/sync-monitor-docs.mjs --check` before release. Structural checks do not constitute independent scientific validation or live URL verification.
<!-- monitor-data-contract:end -->
