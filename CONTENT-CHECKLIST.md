# ⚠️ Read this before showing the site to anyone as "our website"

The site is **complete and working**, but some of the content is **placeholder or
assumed**. I had no source for these facts, so I wrote sensible defaults to make
the pages real and reviewable.

Right now this is an excellent **design and structure preview**. It is not yet an
accurate description of Tiny Steps Montessori. Fix the items below — or tell me
the real answers and I will — before you treat it as the live school website.

---

## 🔴 Blocking — these state things about the school that I invented

These are **not obviously placeholders to a reader.** They look like facts.

| Where | What it currently claims | Action |
|---|---|---|
| Everywhere | Adult-to-child ratios: **1:4** Playgroup, **1:8** Montessori, **1:6** STEM | Replace with your real ratios |
| Everywhere | A **three-hour uninterrupted work cycle** | Confirm this is how you actually run the morning |
| Everywhere | **Three languages** (English / Sinhala / Tamil) used daily | Confirm |
| Programmes | Hours: Playgroup 8:30–11:30, Montessori 8:00–12:30, STEM Sat 9:00–11:00, Daycare to 5:00 PM | Replace with real timetables |
| Programmes | Group sizes: 12 / 24 / 18 / 20 places | Replace |
| `playgroup.md` | A **two-week phased settling-in** with parents in the room | Confirm or rewrite |
| `daycare.md` | Hot **vegetarian** lunch, nap on mats, homework hour | Confirm |
| `src/data/site.ts` | `founded: '2018'` | Set the real year |
| `about.astro` | Safeguarding claims (collection checks, incident logging, staff screening, termly fire drills) | Confirm every line — these are promises to parents |
| `admissions.astro` | "One full term's notice", non-refundable admission fee, assisted places | Confirm your real policies |
| `faq.astro` | ~30 answers covering food, health, safety, notice periods | Read through and correct |

## 🔴 Blocking — obvious placeholders that must be filled

| Where | What to do |
|---|---|
| `src/pages/admissions.astro` | Fee table is all **`LKR 00,000`**. Put in real numbers, or delete the table |
| `src/pages/admissions.astro` | "last year's increase was **0%**" — set the real figure |
| `src/pages/about.astro` | Team section is `[Name]` / `[Two sentences: …]` — add real staff and photos |
| `src/pages/contact.astro` | Form `action="https://formspree.io/f/YOUR_FORM_ID"` — **the form sends nowhere until you fix this** (see below) |
| `src/data/site.ts` | `social.facebook` — confirm the exact page URL |
| `src/data/site.ts` | `social.googleMaps` / `googleReviews` — paste your real Google Business Profile links |
| `src/data/site.ts` | `geo` lat/long is approximate — drop a pin on Google Maps, right-click, copy the exact coordinates |
| `src/data/areas.ts` | Drive times and distances are map estimates — **drive them at 7:45 AM on a Monday** |

## 🟠 Verify — probably right, worth a check

- **Address**, **phone**, **email** came from your Google Business Profile. They must match it **character for character** — this is the single biggest local SEO factor.
- **Opening hours**: I assumed Mon–Fri 8:00–17:00 from "Opens 8 AM Mon". Make them match your Google profile exactly.
- **Rating**: `5.0` from `6` reviews. Update as reviews come in — a stale count in structured data is a quality signal against you.
- **Ages 5+ and the STEM focus** came from your Instagram bio. Confirm.

## 🟢 Real content, safe as written

The eight articles in `src/content/news/` are general parenting and Montessori
guidance, not claims about your school. They are accurate and ready to publish.
The ninth (`open-day-announcement-template.md`) is a **template** set to
`draft: true` — it is not on the live site until you fill in the date and flip
the flag.

---

## Wiring up the contact form

The form is built and validated but has no backend. Pick one:

**Formspree** (works anywhere, free tier)
1. Create a form at [formspree.io](https://formspree.io)
2. In `src/pages/contact.astro`, replace `YOUR_FORM_ID` in the `action` attribute

**Netlify Forms** (only if you deploy to Netlify)
1. Delete the `action` attribute from the `<form>` tag
2. Add `data-netlify="true" netlify-honeypot="company"`

A honeypot field is already in place either way.

---

## Before launch

- [ ] Fix every 🔴 item above
- [ ] Buy the domain and set `SITE_URL` (see `README.md` → Deploying)
- [ ] Add real photographs — a real classroom beats any illustration for conversion
- [ ] Replace `public/images/og-default.jpg` with a 1200×630 photo of the school
- [ ] Claim and complete your **Google Business Profile** — it is ~32% of local ranking
- [ ] Submit `sitemap-index.xml` in Google Search Console
- [ ] Run `npm run audit` one final time
