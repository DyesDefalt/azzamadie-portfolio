# Requirements & documentation index

Use this file with [README.md](../README.md) for onboarding on any machine.

## Functional requirements

| Area | Requirement |
|------|-------------|
| Home | Hero, services preview, GSAP intro, theme toggle, custom cursor (desktop) |
| About | Origin story, scroll-driven sections, no broken ScrollTrigger targets |
| Work | Project/case cards with links and motion |
| Experience | Timeline, certifications, correct currency/copy |
| Features | Demo chat UI, RSA key generator, UTM builder — client-side only |
| Blog | List published posts from Supabase; filter by category name |
| Post | Load by `?slug=`; meta/OG from post fields; tags parsed from JSON or array |
| Admin | Password gate; list/filter posts; link to editor |
| Editor | Password gate; CRUD posts to Supabase |
| CV | Request flow stores rows in `cv_requests`; download page validates token |

## Non-functional requirements

- **Performance:** Lazy-load images where possible; 8s cap on Supabase fetch.
- **SEO:** Per-page meta, canonical URLs, JSON-LD on key pages, `sitemap.xml`.
- **Security headers:** Via `vercel.json` on deploy.
- **Privacy:** Admin/editor/CV pages `noindex`.
- **Resilience:** Graceful blog empty/error states when Supabase is down or paused.

## Data model (Supabase)

### `blog_categories`

- `id`, `name`, `slug`, `created_at` (typical)

### `blog_posts`

- `title`, `slug`, `excerpt`, `content`, `category` (name string), `tags` (JSON array or string), `published`, `published_at`, `cover_image`, SEO fields as used in `post.html`

### `cv_requests`

- Fields used by CV workflow and `cv-download.html` token validation (see `supabase-client.js` and CV page scripts)

RLS must allow:

- Public **read** of published posts and categories (as configured).
- **Insert** for CV requests (if using public form).
- **Write** on posts only for trusted roles — tighten before production admin use.

## Docs map

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | Setup, structure, rules, roadmap |
| [docs/REQUIREMENTS.md](./REQUIREMENTS.md) | This file — scope & data |
| [.cursor/rules/portfolio.mdc](../.cursor/rules/portfolio.mdc) | Cursor AI project rules |
| [.env.example](../.env.example) | Future env var template |
| [vercel.json](../vercel.json) | Deploy config |
| [serve.json](../serve.json) | Local static server |

## Official external docs

- [Supabase JS client](https://supabase.com/docs/reference/javascript/introduction)
- [GSAP 3](https://gsap.com/docs/v3/)
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Vercel static deployments](https://vercel.com/docs/concepts/deployments/overview)
