# Tiny Steps Montessori

Website for [Tiny Steps Montessori](https://maps.app.goo.gl/), a Montessori
preschool and daycare in Dehiwala, Colombo.

Built with [Astro](https://astro.build) — static HTML, near-zero JavaScript,
and a content-collection setup so adding a news article is one markdown file.

> **⚠️ Some content is placeholder or assumed.**
> Read [`CONTENT-CHECKLIST.md`](./CONTENT-CHECKLIST.md) before treating this as
> the live school website.

---

## Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` (also regenerates brand images, then fixes base paths) |
| `npm run preview` | Serve the built site locally |
| `npm run audit` | **SEO pre-flight over `dist/`** — run after every build |
| `npm run images` | Regenerate the OG card and app icons |

---

## How it is organised

```
src/
├── data/
│   ├── site.ts          ← ALL business info. Address, phone, hours, socials.
│   ├── areas.ts         ← Per-suburb copy for the location landing pages
│   └── schema.ts        ← JSON-LD structured-data builders
├── content/
│   ├── news/            ← Articles. One markdown file each.
│   └── programmes/      ← One markdown file per programme
├── components/          ← Header, Footer, BaseHead (all <head> tags), Logo
├── layouts/Base.astro   ← Page shell: head, header, breadcrumbs, footer
├── pages/               ← Routes. File path = URL.
└── styles/global.css    ← Design tokens and shared classes
```

### The one rule

**`src/data/site.ts` is the single source of truth.** Address, phone, email and
hours are read from it by every page, the footer, the contact page and the
structured data.

Local SEO depends on your Name / Address / Phone being *byte-identical* across
your website, your Google Business Profile and every directory listing. Even
small differences suppress rankings. Change it in one place, and it can never
drift.

---

## Adding a news article

Create `src/content/news/your-slug.md`. The filename becomes the URL
(`/news/your-slug`).

```markdown
---
title: "A Title Under About 60 Characters"
description: "70–165 characters. This is what shows in Google results."
publishedAt: 2026-09-01
category: "Parenting Guides"   # or School News / Montessori Method /
                               #    Child Development / Events
readingTime: 6
targetKeyword: "the search this is written to win"
featured: false
draft: false                   # true = written but not published
---

Your article in markdown.
```

The build **fails** if the title or description is the wrong length. That is
deliberate — it is much cheaper to catch here than after Google has indexed it.

Everything else is automatic: the article appears on `/news`, on the home page
if recent, in the RSS feed, in the sitemap, and gets `BlogPosting` structured
data.

### Adding an event

Copy `src/content/news/open-day-announcement-template.md`, fill in the details,
set `draft: false`.

---

## The SEO setup

### What is already in place

- **Structured data on every page** — the school is typed as `Preschool` +
  `ChildCare` + `LocalBusiness`, so it can surface for both "preschool near me"
  and "daycare near me". Plus `WebSite`, `BreadcrumbList`, `FAQPage`,
  `BlogPosting` and `Course` where relevant.
- **Eight location landing pages** (`/montessori-preschool-dehiwala` etc.) —
  each with its own genuinely different route notes, landmarks and angle. This
  matters: eight near-identical pages would be classified as doorway pages and
  could drag the whole domain down.
- **Nine articles, ~28,000 words** targeting the research-phase searches
  competitors ignore entirely.
- **Published fees** — no competitor in Dehiwala does this. It wins
  "preschool fees Sri Lanka" and filters enquiries to families who accept the price.
- Sitemap, RSS, canonicals, Open Graph, `hreflang="en-LK"`, geo meta tags,
  `robots.txt` (AI crawlers explicitly allowed).
- Guardrails: `npm run audit` fails the build on a missing canonical, a second
  `<h1>`, an over-long meta description, or an internal link that 404s.

### What only you can do

Roughly a third of local ranking is your **Google Business Profile**, and none
of it lives in this repo:

1. **Claim the profile** (it currently shows "Own this business?")
2. **Add the website URL** — you have none listed, which is the single biggest gap
3. Post photos regularly; keep hours accurate
4. **Ask every happy parent for a review**, and reply to all of them
5. Get listed consistently on lk directories — same NAP, character for character
6. Verify in [Google Search Console](https://search.google.com/search-console)
   and submit `sitemap-index.xml`

---

## Deploying

The build is environment-driven so the same source works for both targets.

### GitHub Pages (current preview)

Handled by `.github/workflows/deploy.yml` on every push to `main`. It derives
the URL from the repo, so nothing is hardcoded.

Because project sites are served from `/<repo>/`, `scripts/fix-base.mjs` runs
after the build and prefixes root-absolute links. It is a no-op at a domain root.

### The real domain

Once you have `tinystepsmontessori.lk`:

```bash
SITE_URL=https://tinystepsmontessori.lk npm run build
```

Then upload `dist/` — it is plain static files, so any host works (Netlify,
Vercel, Cloudflare Pages, or ordinary cPanel hosting).

For GitHub Pages with the custom domain, add a `CNAME` file to `public/` and
set `SITE_URL` in the workflow; `BASE_PATH` then becomes unnecessary.

---

## Notes

- **No build-time image optimisation is wired up yet** because there are no
  photographs. When you add them, put them in `src/assets/` and use Astro's
  `<Image />` component so they are resized and converted to WebP automatically.
- **Fonts** load from Google Fonts. Self-hosting them would shave ~100ms — worth
  doing before launch, not urgent.
- The site ships **about 3 KB of JavaScript**: a scroll-reveal observer, the
  mobile menu, and the news category filter. Everything works without it.
