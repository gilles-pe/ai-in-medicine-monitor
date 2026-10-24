# Adding content through portable JSON

The content files are ordinary UTF-8 JSON, independent of the dashboard. Use stable IDs and HTTPS original sources. Preserve original records and unknown values as null. Data import is editorial: no automatic approval or publication.

## Which file and collection?

| Content | Authoritative location | Connected record |
| --- | --- | --- |
| Benchmark measurement | data/monitor-data.json → tracks[].series[].data[] | editorialCards[cardId] |
| Benchmark/track description | tracks[].readingGuide and series[].readingGuide | Existing seriesId and real metric |
| Original source | extensions.legacyDashboard.sourceCatalog[] | Unique sourceId referenced by study/milestone |
| Study | extensions.legacyDashboard.studies[] | sourceId + editorialCards[cardId] |
| Lower-chart milestone | extensions.legacyDashboard.trackMilestones[] | trackId, sourceId, cardId |
| Overview source point | extensions.legacyDashboard.pointEvidence[] | seriesId, sourceId, cardId |
| General historical event | extensions.legacyDashboard.historyEvents[] | sourceId, cardId |
| News/article/cross-posts | data/news.json → items[] | Approved item with original publication date and sources[] |
| External related resource | extensions.navigation.relatedLinks[] | title, publisher, url |
| Interface translations | extensions.locales.de | English string → German translation |

The legacyDashboard name is historical. These collections remain live and authoritative; adapters in data/*.js read them. Do not create a duplicate source or another content database.

## New measurement

Choose the exact existing benchmark series only when test version, scoring, subset and harness are comparable. Otherwise add an independent series. A measurement needs id, model, modelReleaseDate, evaluationDate, publicationDate, value, setup, explain, validation, sources and cardId. Unknown dates are null; availability dates are not test dates. A proposed unreviewed value starts with validation.status needs_review and is excluded from the published main line.

Its editorial card needs badge, tags, a quantitative finding/teaser, setup, concrete limitations, timeline_year, evidence_date/date_basis, original-source links with a separate journal_citation, and validation. Keep the value/unit identical to the measurement. Follow a current complete record rather than inventing a partial shape. Never set confirmed or same_protocol merely to make a line appear.

## New source, study or milestone

Add a sourceCatalog record with id, title, url, publisher, version, checkedAt, kind and summary. Only use a checkedAt date if the link was actually checked. Reference its ID from the appropriate study/milestone and add a complete matching editorial card. A historical/conceptual milestone may use a documented categorical finding rather than an invented score. A study is not automatically a comparable benchmark point.

## New news item

Use data/news.json's items array and read docs/news-editorial.md. An approved item has a stable id, original YYYY-MM-DD date, approved true, English/German title and summary, and named sources for the original and cross-posts. Set category (article/post) and verified originalLanguage (en/de); this is the language of the original post, not its translated headline. Keep cross-posts together; do not duplicate one story across platforms. Use the owner's existing explicit approval when present; otherwise obtain it before publishing. Four items appear on the home page; the archive retains all approved items. News additions do not change evidence-review dates.

## Validate and publish

1. Record what changed and any factual review in docs/implementation-status.md; add remaining work to root TODO.md.
2. After a central JSON change run node scripts/sync-monitor-docs.mjs. Advance evidence-review dates only for actual evidence review.
3. Run npm test, npm run typecheck, npm run build and node scripts/verify-pages.mjs. For UI changes also run production browser tests.
4. Review the resulting charts/cards/news; preserve independent benchmark lines and the 2030 horizon.
5. Commit to the GitHub repository and verify the gated Publish GitHub Pages deployment. Source and news files are included in the portable export.
