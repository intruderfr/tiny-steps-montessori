import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../data/site';

/**
 * RSS feed for the news section.
 * Beyond readers, this is how aggregators and AI crawlers discover new posts
 * quickly — it shortens the gap between publishing and being indexed.
 */
export async function GET(context: APIContext) {
  const posts = (await getCollection('news', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: `${site.name} — News & Parent Guides`,
    description:
      'Honest, practical writing for parents choosing a preschool in Colombo, from Tiny Steps Montessori in Dehiwala.',
    site: context.site ?? site.url,
    trailingSlash: false,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.publishedAt,
      link: `/news/${p.id}`,
      categories: [p.data.category],
      author: p.data.author,
    })),
    customData: `<language>en-lk</language><copyright>Copyright ${new Date().getFullYear()} ${site.legalName}</copyright>`,
  });
}
