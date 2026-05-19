# Ahmad Azzam Fuadie — Portfolio

Production portfolio for [azzamadie.me](https://azzamadie.me): a static multi-page site with GSAP motion, a Supabase-backed blog/CMS, CV request workflow, and interactive feature demos. No build step required.

**Repository:** [github.com/DyesDefalt/azzamadie-portfolio](https://github.com/DyesDefalt/azzamadie-portfolio)

---

## Quick start (any machine)

### Requirements

| Requirement | Notes |
|-------------|--------|
| Modern browser | Chrome, Firefox, Safari, or Edge (last 2 versions) |
| Static file server | Required for local dev (see below) |
| Internet | GSAP, Supabase SDK, and Google Fonts load from CDN |
| Optional: Python 3 | For `python -m http.server` |
| Optional: Node.js | For `npx serve` or Vercel CLI |
| Optional: Git | Clone and deploy |

### Run locally

From the project root:

```bash
# Python (recommended)
python -m http.server 8765

# Or Node
npx serve -l 8765
```

Open [http://localhost:8765](http://localhost:8765).

> **Do not** open HTML files directly with `file://` — Supabase fetch, module scripts, and some animations expect an HTTP origin.

### Verify after clone

1. Home (`index.html`) — hero, preloader, theme toggle  
2. About (`about.html`) — no ScrollTrigger console errors  
3. Blog (`blog.html`) — categories load (needs active Supabase project)  
4. Admin (`admin.html`) — gate password (see [Admin & CMS](#admin--cms))

---

## Project structure

```
azzamadie-portfolio/
├── index.html          # Home
├── about.html          # Story / about
├── work.html           # Case studies
├── experience.html     # Timeline & certifications
├── features.html       # AI chat demo, RSA, UTM builder
├── blog.html           # Blog listing (Supabase)
├── post.html           # Single post (?slug=)
├── admin.html          # Blog dashboard (password gate)
├── editor.html         # Create/edit posts
├── cv-download.html    # Approved CV download links
├── app.js              # Global: theme, nav, preloader, cursor, transitions
├── pages.js            # Page-specific GSAP / ScrollTrigger
├── features.js         # Features page interactivity
├── shared-motion.js    # Blog/post motion helpers
├── supabase-client.js  # Supabase client + blog/CV API helpers
├── base.css            # Tokens, reset, utilities
├── style.css           # Global components
├── pages.css           # Page layouts
├── blog.css            # Blog/admin styles
├── assets/             # Images, PDFs (CV, slides)
├── vercel.json         # Deploy headers & routing
├── serve.json          # Local serve config (cleanUrls)
├── sitemap.xml
├── robots.txt
└── .cursor/rules/      # Cursor AI project rules (optional)
```

---

## External services

### CDN dependencies (no npm install)

- [GSAP 3](https://gsap.com/) + ScrollTrigger — loaded per page from `cdnjs` / `unpkg`
- [@supabase/supabase-js v2](https://supabase.com/docs/reference/javascript) — blog & CV
- [Google Fonts](https://fonts.google.com/) — Plus Jakarta Sans, JetBrains Mono

### Supabase (blog + CV requests)

| Setting | Location |
|---------|----------|
| Project URL | `supabase-client.js` → `SUPABASE_URL` |
| Anon (public) key | `supabase-client.js` → `SUPABASE_ANON_KEY` |
| Project ref | `bpvvfbobgwrmukdqmvnw` |

**Tables:** `blog_categories`, `blog_posts`, `cv_requests` (with RLS policies for public read / anon insert where configured).

If the blog shows endless loading or network errors:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and confirm the project is **Active** (free tier projects pause after inactivity).
2. Check browser DevTools → Network for `*.supabase.co` failures.
3. Client uses an **8s fetch timeout** in `supabase-client.js` so paused projects fail fast instead of hanging.

To use your own Supabase project: update URL and anon key in `supabase-client.js`, run migrations for the three tables, and seed categories as needed.

### Deployment (Vercel)

1. Import repo in [Vercel](https://vercel.com).
2. Framework preset: **Other** (static).
3. No build command; output directory is the repo root.
4. Custom domain: `azzamadie.me` (DNS at your registrar).

`vercel.json` sets security headers (`X-Content-Type-Options`, `X-Frame-Options`).

---

## Admin & CMS

| Page | URL | Purpose |
|------|-----|---------|
| Admin | `/admin.html` | List posts, filter by category, links to editor |
| Editor | `/editor.html` | Create/edit blog posts |
| CV download | `/cv-download.html?token=…` | Gated PDF after approved `cv_requests` row |

**Admin gate:** Client-side password in `admin.html` and `editor.html` (`ADMIN_PASSWORD`). This is **not** secure for production secrets — treat it as a convenience barrier only. For real security, use Supabase Auth + RLS write policies or a serverless admin API.

**Robots:** `admin.html`, `editor.html`, and `cv-download.html` use `noindex,nofollow`.

---

## Environment variables (optional future)

The repo currently inlines the Supabase **anon** key (safe to expose in frontend; protected by RLS). For cleaner deploys you may later:

1. Add a tiny build step or inject script that reads `SUPABASE_URL` / `SUPABASE_ANON_KEY` from Vercel env.
2. Copy `.env.example` → `.env` locally (`.env` is gitignored).

---

## Development conventions

These match how the codebase is written and how Cursor/AI assistants should behave on this repo. Full Cursor rule file: [`.cursor/rules/portfolio.mdc`](.cursor/rules/portfolio.mdc).

### Project rules (coding)

1. **Minimize scope** — Smallest correct diff; do not refactor unrelated files.
2. **Match existing patterns** — Vanilla JS, BEM-ish classes, CSS variables in `base.css`, GSAP in `pages.js` / `app.js`.
3. **No over-engineering** — No bundler unless there is a clear need; no one-off helper files for single use.
4. **Magnetic buttons** — Use `magnetic-wrap` on the element; `data-magnetic` alone does not enable hover (handled in `app.js`).
5. **ScrollTrigger** — Guard with element checks before `gsap.to` / timelines; wrong selectors cause console noise on About.
6. **Supabase** — Use helpers in `supabase-client.js` (`safeQuery`, `parseTags`, `formatSupabaseError`); blog categories filter by **name**, not slug.
7. **Comments** — Only for non-obvious business logic.
8. **Secrets** — Never commit `.env`, service role keys, or real admin passwords in docs/commits.

### User / collaboration rules (for contributors & AI)

1. **Evidence before claims** — Run the local server and check the browser before saying something is fixed.
2. **Complete sentences** — README, commits, and PR text should be clear prose, not bullet fragments only.
3. **Commits** — Only when asked; use repo-style messages (`fix:`, `content:`, `docs:`).
4. **No destructive git** — No force-push to `master` unless explicitly requested.
5. **Accessibility** — Respect `prefers-reduced-motion` (partially implemented); keep semantic HTML and `aria-label`s on nav controls.
6. **English copy** — Site content is English; keep tone professional and human.

### Git workflow

```bash
git add -A
git commit -m "fix: describe why, not only what"
git push origin master
```

---

## Browser & performance notes

- Large assets live under `assets/` (photos, PDFs) — optimize images (WebP/AVIF, responsive `srcset`) in future updates.
- Theme is stored in `localStorage` (`data-theme` on `<html>`).
- Preloader and custom cursor can be heavy on low-end devices; reduced-motion CSS limits some animation.

---

## Troubleshooting

| Symptom | Likely cause | Action |
|---------|----------------|--------|
| Blog stuck on “Loading…” | Supabase paused or wrong keys | Restore project; check `supabase-client.js` |
| `[]` tag chip on posts | Tags stored as JSON string | Fixed via `parseTags()` — republish post if old data |
| ScrollTrigger “target not found” on About | Wrong selector | Use `.about-lab__visual`, `.about-pivot__equation` |
| Admin filter empty | Category value mismatch | Options use `cat.name`, not `cat.slug` |
| CORS / file protocol errors | Opened via `file://` | Use `http://localhost:8765` |

---

## Recommended next updates

Prioritized ideas for evolving the portfolio:

### High impact

1. **Secure admin** — Supabase Auth (magic link or OAuth) + RLS policies so only your user can insert/update `blog_posts`.
2. **Supabase env injection** — Move URL/key to Vercel environment variables; optional small inject script at deploy.
3. **Content** — Publish 3–5 blog posts; add case-study detail pages or expand `work.html` with metrics.
4. **Image pipeline** — Compress `assets/`, add WebP sources and `loading="lazy"` audit sitewide.

### Product & UX

5. **Contact form** — Replace mailto-only CTA with Formspree, Resend, or Supabase Edge Function + email.
6. **CV workflow** — Admin UI to approve `cv_requests` and auto-email magic links.
7. **Analytics** — GA4 or Plausible with a documented event plan (blog read, CV download, feature demos).
8. **Accessibility pass** — Focus rings, skip link, keyboard nav on mobile menu, audit contrast in dark mode.

### Engineering

9. **Component reuse** — Shared nav/footer via build-time include (11ty) or minimal Vite only if duplication hurts maintenance.
10. **CI** — GitHub Action: HTML validate, Lighthouse CI on PRs.
11. **Monitoring** — Uptime check on Supabase + Vercel; alert when project pauses.
12. **i18n** — Only if you need Bahasa Indonesia mirror; keep English primary.

### Nice to have

13. **RSS feed** for blog (`/feed.xml` generated from Supabase or static).
14. **Open Graph images** per post (dynamic or template PNG).
15. **PWA** — Offline shell for home/about only.

---

## License & contact

© Ahmad Azzam Fuadie. Site content and branding are personal portfolio assets.

- **Site:** [azzamadie.me](https://azzamadie.me)
- **Email:** hello@azzamadie.me
- **LinkedIn:** [ahmadazzamfuadie](https://www.linkedin.com/in/ahmadazzamfuadie/)

---

## Changelog (recent)

- **Blog/CMS:** Supabase error handling, 8s timeout, `parseTags`, admin category filter by name  
- **About:** ScrollTrigger selector fixes in `pages.js`  
- **Experience / Features:** Copy and magnetic-wrap fixes  
- **Supabase:** Schema restored for blog + CV tables on project `bpvvfbobgwrmukdqmvnw`
