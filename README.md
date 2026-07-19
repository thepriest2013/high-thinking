# High Thinking

Blog by The Priest — personal development, personal finance, and geopolitics musings. Built with [Astro](https://astro.build).

## Structure

```text
/
├── public/                  static assets (favicon, images)
├── src/
│   ├── components/Logo.astro
│   ├── content/blog/*.md    posts (content collection)
│   ├── content.config.ts    post frontmatter schema
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro      home
│   │   ├── about.astro
│   │   └── blog/
│   │       ├── index.astro  archive
│   │       └── [...slug].astro
│   └── styles/global.css
```

## Writing a post

Add a `.md` file under `src/content/blog/` with frontmatter:

```yaml
---
title: 'Post title'
description: 'One-line summary for the archive list.'
pubDate: 2026-07-19
category: 'personal-development' # or personal-finance | geopolitics | general
draft: false
---
```

Files prefixed `_example-*.md` are templates (`draft: true`) — edit or delete them.

## Commands

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start local dev server at `localhost:4321`   |
| `npm run build`    | Build production site to `./dist/`           |
| `npm run preview`  | Preview the build locally                    |
