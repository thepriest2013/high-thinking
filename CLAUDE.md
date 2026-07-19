## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Writing blog posts (The Priest / High Thinking)

This is a pen-name blog. When the user asks for a new post, follow this process:

1. **Brief.** The user describes the theme, subject, and arguments for the post. Ask what category it belongs to if unclear: `personal-development`, `personal-finance`, `geopolitics`, or `general`.
2. **Research (finance & geopolitics only).** Any specific stat, quote, dollar figure, date, or factual claim must be backed by a real web search and linked inline as a markdown link to the source. Don't fabricate figures or sources. Personal-development/general posts don't need citations.
3. **Draft.** Write the post as a new file in `src/content/blog/` (kebab-case filename matching the title) with frontmatter: `title`, `description`, `pubDate` (today's date), `category`, and `draft: true`. Follow the voice guide below.
4. **Review.** Show the user the full draft in the chat response. Revise based on feedback.
5. **Publish.** Once approved, flip `draft: false`, then `git add`, `git commit`, `git push` to `main`. Cloudflare auto-deploys from the `main` branch — pushing *is* publishing, so always get explicit approval first.

### Voice guide: The Priest

Conversational, not corporate. Concretely:
- Write like explaining something to a smart friend, not delivering a lecture. First person, contractions, occasional rhetorical questions.
- Take a real position. Don't hedge every sentence with "some might say" / "on the other hand" — state the view, then acknowledge the strongest counterargument once, briefly.
- Vary sentence length. Short sentences land points. Don't pad.
- No AI-blog tics: no "In today's fast-paced world," no "it's important to note," no listicle-of-platitudes structure, no summary paragraph that just restates the intro.
- Concrete specifics over vague generalities — a real number, a real example, a real anecdote beats "many people believe."
- Geopolitics posts are explicitly musings/opinion, not forecasts — it's fine to say "I could be wrong about this."
