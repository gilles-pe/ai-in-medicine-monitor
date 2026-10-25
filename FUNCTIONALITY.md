# Functionality and acceptance contract

Current specification: 25 October 2026. Read alongside DESIGN.md and MONITOR_STANDARD.md. This file describes required behavior; successful tests and publication are recorded in docs/implementation-status.md. Root TODO.md is the active backlog.

## Published initialization

- Static HTML remains readable without JavaScript. The built home page retains a real native module entry point for app.js; a build must never turn the closing script tag into literal escaped text.
- After event handlers, data rendering and translation initialize successfully, html[data-app-state] becomes ready. Tests must wait for this state and fail on uncaught page errors.
- Browser tests run against the actual dist artifact under /ai-in-medicine-monitor/, including JSON imports and all relative assets. The Pages publication must pass these tests before deployment.
- Built stylesheets use a content-fingerprinted filename. Returning browsers receive the current layout after publication even when the previous CSS remains cached.

## Editorial admission contract
Every new score, study or milestone must pass the source and impact gates in `docs/MEASUREMENT_INTAKE.md` before publication. Ambiguous inclusion, clinical meaning or milestones require owner approval and documented feedback before insertion. The portable ZIP includes the intake policy and historical source-audit ledger.

## Classification contract
The source-linked taxonomy is specified in `docs/EVIDENCE_TAGGING.md`. Every editorial card has a standardized topic, test setting and design; milestone and real-patient/outcome evidence are independent. Detail cards, milestone filters, chart Data tables, Glossary and any linked clinical-news tags must derive from the same central JSON metadata. Evidence filtering must not alter chart observations or source-validation status.

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

- The masthead reads Gilles Penning, followed by Tracking what AI can do in medicine. These owner-approved words are intentional.
- What can AI do in medicine today? is always visible outside the introduction disclosure. The introduction starts open above 860px and closed at 860px or below. Closed previews retain a readable first line and fading second line. A user toggle survives resizing within the same breakpoint.
- Medtech executive. Founder. belongs in the author/profile area beside the reserved image, not the masthead tagline. Use the owner-supplied portrait, with an accurate alt description and the image beside this profile wording.
- Glossary and every Sources section start closed and use native triangle disclosures. The redundant global Studies and Sources indexes are removed; study cards remain available from chart points. A user-opened Sources panel survives chart updates.
- Timeline controls live in the burger menu, without a separate Milestones bar, and preserve their disclosure state through slider/model/viewport changes. Source explanations stay compact and visible around each lower chart.

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

25 October 2026 - current editorial layout: the introduction starts open on desktop and closed on mobile; news summaries start closed, showing one complete line and a fading second line beside a native disclosure triangle. News titles stay visible and use the small-chart sans-serif heading family. Expanded news includes category/language plus right-aligned source links. Original thumbnails are square, small and right-aligned. The archive is Chronological news, with a Back to medical AI dashboard link, crawlable full text, RSS, canonical URL and ItemList metadata. Global bottom Sources/Studies and duplicate milestone index are removed; chart source cards and timeline controls remain. A single generated masthead, section navigation and burger menu covers every page; about me is the profile menu label.

## Responsive compact layout — 25 October 2026

The introduction opens by default above 860px and closes below this breakpoint; the native triangle always permits manual toggling. News previews clip both text and the original thumbnail to the same two-line fade on desktop; mobile previews omit the image until expanded. Latest News and Chronological News use capital N. Medical Knowledge, Clinical Assistance and Autonomous Workflows use title case in thumbnails and detail charts. The lower-chart heading and source-linked best eligible benchmark value share one row. Both independent benchmark series remain visible without a selector. The assistance note says no verified human baseline is available in this dataset; never display the archived unvalidated baseline as a clinical reference. Glossary uses smaller sans-serif typography. The global Milestones bar is removed; stable time controls are in the dashboard burger menu. The bilingual privacy notice describes actual static hosting, local language storage, externally loaded original thumbnails and outgoing social/source links.

Latest layout correction (25 October): lower charts read title/value → measurement question → answer/takeaway → plot and compact context → milestone tiles → Data table → Sources. All chart Data table disclosures start closed, with a native triangle and the same micro-label styling as Sources.

Expanded-chart hover cards reserve the title/control row and never cover the full-view exit button.

25 October 2026 - latest owner correction: benchmark value sits immediately beside its chart title; review date sits small below the hamburger button. Menu uses About Me, icon-only social links including X, and a bottom row with Feedback left and language right. Presentation controls/behavior, menu News link, timeline playback/date/model controls removed. Historical share URL cutoff remains supported. X profile URL is not verified; its icon currently links to the X homepage. This supersedes earlier timeline/presentation/menu requirements. Release checks pending.

25 October 2026 - chart windows and image export: all four charts offer All time / 5Y / 2Y / 1Y / 6M controls below their plots; chosen windows survive full-view and resize. Axes show actual units and adapt with padding to the visible observations; zero remains when appropriate. The overview remains illustrative and all-time retains the 1950–2030 scenarios. Full-view charts offer PNG export with repeated low-contrast ai.gillespenning.com credits rasterized inside the plot, retaining title/date/evidence caveats. Image attribution discourages cropping but is not tamper-proof. News filters removed; owner-confirmed X profile installed. Three authorized Substack Notes are retained in data/news.json coverage.requestedNotes pending verifiable original text/date; see docs/NEWS_COVERAGE.md. No study scores or scientific review date changed. Release checks pending.

Time-window release acceptance: the new 44px touch-target row plus margins adds up to 52px to the existing 620px lower-chart budget (672px total). The first release run passed 42 browser cases, including all eight PNG downloads, and failed only the obsolete mobile height budget (637px). Updated this layout budget explicitly; no interaction or data checks removed.
