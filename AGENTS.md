# AI in Medicine Monitor

## Scope

On 2026-10-17 the user authorized implementing the dashboard and using smart subagents. The repository now contains the first dependency-free static application plus planning and source documents. Recurring medical-data updates remain unconfigured.

## Project context

Read README.md, docs/project-brief.md, docs/decisions.md, docs/data-sources.md and docs/implementation-status.md before changes. The active handover is docs/ai-in-medicine-monitor-handover.md. Its original planning-only limitation was superseded by the user's explicit implementation request. Preserve the visual direction described in docs/design/README.md and the separate autonomy track. The original image at docs/design/reference-variant-a.jpg is schematic, never numeric evidence.

## Data and evidence

data/evidence.js owns curated results, sources and events. The initial 13 results are historical paper-publication snapshots, not current SOTA or a complete model comparison. Do not invent benchmark results, clinical claims or trend curves. The user explicitly requested the PPT-style 1950–2035 overview on 2026-10-17: its extracted schematic positions in data/presentation-chart.js may be displayed only as an illustration, with future scenarios and the METR software context labelled. Never mix that index with benchmark scores. Only connect methodologically comparable results from the same comparisonGroup. Keep model/system configuration, source, version, date basis and limitations attached to each result. Distinguish simulation, clinical study and routine deployment.

The interface must not imply that HealthBench points are percent accuracy or that MedAgentBench demonstrates safe autonomous care. The initial dataset has no independent clinical/editorial approval. The source review of 2026-10-17 is documented.

## Development

Vanilla browser ES modules and CSS. No runtime dependencies. npm test runs Node builtin tests; npm run test:ui runs Playwright; npm run build packages dist/. Code CI is not a medical-data update automation. Do not expose secrets, patient records or benchmark questions. Preserve privacy when selecting hosting.

## Coordination

The shared Drive brief is linked in README.md. Read its current version before materially changing goals. No automatic synchronization of chats, Drive or repository data exists. New explicit user instructions override older planning snapshots.

## Validation limits

The implementation was created through GitHub because the local environment was unavailable. Never infer successful browser QA, CI or publication from code being committed. Read the latest workflow result and implementation-status.md before claiming them.
