# Functionality and acceptance contract

Current specification: 25 October 2026. Read alongside DESIGN.md and MONITOR_STANDARD.md. This file describes required behavior; successful tests and publication are recorded in docs/implementation-status.md. Root TODO.md is the active backlog.

## Published initialization

- Static HTML remains readable without JavaScript. The built home page retains a real native module entry point for app.js; a build must never turn the closing script tag into literal escaped text.
- After event handlers, data rendering and translation initialize successfully, html[data-app-state] becomes ready. Tests must wait for this state and fail on uncaught page errors.
- Browser tests run against the actual dist artifact under /ai-in-medicine-monitor/, including JSON imports and all relative assets. The Pages publication must pass these tests before deployment.

## Evidence cards and sample selection

- Desktop: every source-backed overview/lower-chart point reveals an interactive hover card. Moving onto the original-source link keeps the card reachable. Click or Enter pins the card.
- Phone/tablet: tap opens the same evidence card as a bottom sheet. Hover is never required. Overview taps resolve a source within a 44px CSS target despite SVG scaling; nearby sources offer a switcher in one card.
- A selected point/milestone stays highlighted. Grouped results have one active card and a working result switcher. Close and Escape dismiss the card and return focus to the trigger.
- Cards show the quantitative finding, setup/cohort, actual limitations, evidence status and original sources. Future or unconfirmed measurements never acquire an invented curve.
- Horizontal overview dragging scrubs the cursor/milestones without opening a card. Vertical gestures remain page scrolling. Keyboard source activation is independent of scrubbing.

## Full chart view

- Overview and all three lower charts have a 44px expand/close control. This is a CSS full-viewport inspection view that works without browser Fullscreen API support.
- The active control reports pressed state and Exit full view. Escape, the same control and backdrop close it; focus returns to the chart control. Tab stays inside the expanded chart while no source dialog is open.
- Source cards and grouped selection also work within the expanded chart. Date/model updates retain the active chart view.

## Disclosure defaults and layout

- The masthead reads Still pending, followed by Tracking what I can really do in medicine. These owner-approved words are intentional.
- What can I do in medicine today? is always visible outside the introduction disclosure. The triangle and explanatory content sit beneath it, initially open.
- Medtech executive. Founder. belongs in the author/profile area beside the reserved image, not the masthead tagline. The current GP monogram is a placeholder and must be described truthfully until an owner portrait is supplied.
- Glossary and every Sources section start closed and use native triangle disclosures. Studies remains a native disclosure. A user-opened Sources panel survives chart updates.
- Milestones contains stable timeline controls and stays open through slider/model/viewport changes. Source explanations stay compact and visible around each lower chart.

## Menu, language and navigation

- Menu, direct-message feedback, EN/DE and presentation controls operate after production initialization. Escape/outside click close the menu; keyboard focus cycles through its controls.
- Language changes preserve cutoff/model and open disclosures. Source titles, model names and stored facts remain unchanged.
- Three thumbnails link to the lower charts. Related resources open safely in a new tab. News preview shows four approved items, and All opens the full archive.

## Portable content and documentation

- data/monitor-data.json is authoritative for charts, editorial cards, studies, sources, milestones, translations and navigation. data/news.json is the approved editorial feed. Do not introduce competing stores or hard-code new benchmark scores in the UI.
- docs/data-entry-guide.md maps each entry type to the correct JSON location and its checks.
- The portable export contains both JSON files, policy documents, this specification, TODO, design decisions and per-run history with checksums. Generated data contracts must match the central measurement JSON.
- Scientific review dates describe actual evidence review. UI/news repairs do not claim a fresh scientific validation.

## Required release checks for interaction changes

Production build, JSON/document contract, unit tests and Pages path checks; desktop and touch browser cases for boot, cards, grouped switching, source links, full-view entry/exit, disclosure defaults, persistent timeline, language/menu and 320/375/768/1280px layout. Record exactly what ran and any remaining limits. Performance/contrast audits are separate from functional test success.
