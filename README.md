# AI in Medicine

A compact English dashboard with an illustrative historical overview and three benchmark-specific medical-AI timelines. The existing design, studies, milestone rails, presentation mode, model/date controls and chart exports remain available.

## Authoritative content

Read [AGENTS.md](AGENTS.md), [MONITOR_STANDARD.md](MONITOR_STANDARD.md), [DESIGN.md](DESIGN.md) and [VALIDATION_REPORT.md](VALIDATION_REPORT.md) first.

`data/monitor-data.json` is the single portable content source. The v1.1 import contains 41 observations in five benchmark series: 18 score records confirmed, 23 under review. Only 17 confirmed same-protocol agent scores qualify for a line; release months and imported publication timing remain provisional. Knowledge and assistance show explicit provisional point previews rather than an invented confirmed trend. Unvalidated baselines and saturation claims are retained in the file but not rendered as established references.

Frontiers are recalculated at render time, separately for each benchmark. Historical cutoffs also require the result publication to be available; retrospective testing is labelled. Release-month position is an availability proxy, not an evaluation date. A benchmark score does not establish safe clinical care.

Previous dashboard content is preserved in `extensions.legacyDashboard`. Compatibility modules in `data/*.js` read that central store; they no longer own factual copies. The imported 41 records, original values and legacy metadata are retained. The import correction and original JSON checksum are in `meta.changeLog`.

## Run and verify

Node.js 22 or later. No runtime packages or backend are required. Serve the checkout or built `dist/` over HTTP; the browser must support JSON ES-module imports.

```sh
npm install
node scripts/validate-monitor.mjs
node scripts/sync-monitor-docs.mjs
npm test
npm run build
```

After changing JSON, regenerate documentation with `node scripts/sync-monitor-docs.mjs`. The build and tests reject stale document hashes. For browser checks, install the existing Playwright dev dependency/browser and run `npm run test:ui`; CI runs desktop/mobile checks automatically. These are software and data-contract checks, not independent scientific review.

## Portable exports

- Monitor data: complete central JSON.
- Export selection: historical selection plus the complete portable monitor dataset.
- Export package: central JSON, all four policy/audit Markdown files, generated data status and per-file checksums. The browser verifies document/data hashes before exporting.
- Save image: chart PNG. Multi-benchmark tracks include each separate benchmark panel and provisional-status context.

No weekly evidence-update automation is configured. Last review and last data change are separate metadata fields.

## Hosting

Target GitHub Pages URL: https://gilles-pe.github.io/ai-in-medicine-monitor/

The `Publish GitHub Pages` workflow checks the data/application logic, builds only the static website into `dist/`, verifies that all local paths work beneath `/ai-in-medicine-monitor/`, and deploys it with GitHub's official Pages actions. Pushes to `main` publish automatically after Pages is enabled; the workflow can also be run manually. No extra deployment token is needed.

One-time repository setup: **Settings → Pages → Build and deployment → Source → GitHub Actions**. A private source repository requires a GitHub plan that supports Pages for private repositories. The resulting website is public.

The archive is available at `news/`. To add news, follow [the editorial workflow](docs/news-editorial.md); individual approval, original publication dates and Substack stars remain required.

The previous Sites deployment and `.openai/hosting.json` are retained during migration. The old URL remains https://ai-in-medicine-monitor.gillesp.chatgpt.site. Treat the migration as complete only after the Pages deployment succeeds and its dashboard, news archive and exports have been checked.
