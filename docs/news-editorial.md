# Adding interesting news

Both the dashboard preview and `/news/` archive read `data/news.json` through `lib/news.js`.

1. Read the original published post and verify its author, link and publication date.
2. Propose the title, short preview, date and source link to Gilles. Obtain individual approval for each story before adding it.
3. Add a stable `id`, original `date` (`YYYY-MM-DD`), `approved: true`, English/German `title` and `summary`, and named `sources` (`substack`, `linkedin`, `bluesky` or `ted`). Keep original article titles when appropriate. Do not infer missing publication dates from relative time labels.
4. Group cross-posts beneath the original story instead of duplicating it. A Substack source automatically adds a star. The original story date determines its chronological position.
5. Run the existing checks and build, then commit the approved update to the GitHub repository. The Publish GitHub Pages workflow deploys `main` after Pages is enabled. During migration, the existing Sites deployment remains available.

The newest three stories appear on the dashboard. The archive retains all approved stories, newest first. Older entries stay available when newer items are added. There is no scheduled import or automatic publication.
