# Rigwise content

All site content lives in `launch.json`: categories, topics, the publication byline and articles.

## Add or update an article

Write a Markdown draft with `# TITLE`, `# SLUG`, `# META TITLE`, `# META DESCRIPTION`, `# ARTICLE BODY` and `# EXTERNAL SOURCES USED` sections, then run:

    node scripts/import-article.mjs draft.md --category <gpu|cpu|memory|storage|power|monitors> --tags a,b --hero /images/articles/<name>.webp --hero-alt "..."

Tags that match a topic slug link the article to that topic. Article text supports `**bold**`, `*italic*` and `[label](url)`; links starting with `/` are internal.

## Images

Each article has a 1600x900 image in `public/images/articles/<name>.webp` and a 600x338 card version saved as `<name>-thumb.webp`.

## Site settings

The site name, tagline and description are in `lib/site.ts`. Set `NEXT_PUBLIC_SITE_URL` to the site's real address and `NEXT_PUBLIC_CONTACT_EMAIL` to enable the Contact page.
