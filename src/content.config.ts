import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * NEWS — the SEO engine of the site.
 *
 * Competitor schools in Dehiwala publish nothing. Every genuinely useful article
 * here is a page they cannot rank against, and it lets Tiny Steps capture
 * "research phase" searches ("when should my child start preschool in
 * Sri Lanka?") months before the parent is ready to search for a school by name.
 */
const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Shorter <title> for search results, when the on-page headline runs long.
     *  Falls back to `title`. Keep it under 60 characters. */
    metaTitle: z.string().max(60).optional(),
    description: z.string().min(70).max(165, 'Meta descriptions truncate around 160 chars'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Drives the coloured category chip and the /news filter. */
    category: z.enum([
      'School News',
      'Parenting Guides',
      'Montessori Method',
      'Child Development',
      'Events',
    ]),
    author: z.string().default('Tiny Steps Montessori'),
    /** Path under /public, e.g. "/images/news/first-day.jpg" */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** The search intent this article is written to win. Documentation only. */
    targetKeyword: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

/**
 * PROGRAMMES — one page per age band. Each is marked up as a schema.org Course
 * and is the landing page for its own keyword cluster.
 */
const programmes = defineCollection({
  loader: glob({ base: './src/content/programmes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Shorter <title> for search results. Falls back to `title`. */
    metaTitle: z.string().max(60).optional(),
    /** Short label for nav and cards, e.g. "Playgroup". */
    shortTitle: z.string(),
    description: z.string().min(70).max(165),
    ageRange: z.string(), // e.g. "1-2 years"
    ageLabel: z.string(), // e.g. "1 – 2 years"
    /** Sort order in listings. */
    order: z.number(),
    /** Design token name driving the card colour: sun | teal | coral | sage | plum | sky */
    accent: z.enum(['sun', 'teal', 'coral', 'sage', 'plum', 'sky']),
    /** Emoji or short glyph shown on the card. */
    icon: z.string(),
    schedule: z.string(),
    ratio: z.string(),
    capacity: z.string(),
    highlights: z.array(z.string()).min(3),
    image: z.string().optional(),
    targetKeyword: z.string().optional(),
  }),
});

export const collections = { news, programmes };
