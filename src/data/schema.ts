/**
 * JSON-LD structured data builders.
 *
 * Google reads these to understand *what this business is* rather than guessing
 * from prose. For a local school the payoff is concrete: rich results, the
 * knowledge panel, eligibility for the Map Pack, and — increasingly — being the
 * source an AI Overview quotes when someone asks "best montessori in Dehiwala".
 *
 * Everything below derives from src/data/site.ts, so the structured data can
 * never contradict the visible NAP on the page (a classic ranking-suppressor).
 */
import { site, abs, addressOneLine } from './site';

const ID = {
  school: abs('/#school'),
  website: abs('/#website'),
  org: abs('/#organization'),
};

/** PostalAddress reused by every place-ish node. */
const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
};

const openingHours = site.hours.map((h) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
  opens: h.opens,
  closes: h.closes,
}));

const sameAs = [site.social.facebook, site.social.instagram, site.social.youtube].filter(Boolean);

/**
 * The primary entity. Typed as both Preschool and ChildCare because Tiny Steps
 * genuinely does both — that dual typing is what lets it surface for
 * "preschool near me" *and* "daycare near me".
 */
export const schoolSchema = () => ({
  '@type': ['Preschool', 'ChildCare', 'LocalBusiness'],
  '@id': ID.school,
  name: site.name,
  legalName: site.legalName,
  alternateName: 'Tiny Steps Montessori Dehiwala',
  description: site.description,
  slogan: site.tagline,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  foundingDate: site.founded,
  address: postalAddress,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: site.geo.latitude,
    longitude: site.geo.longitude,
  },
  hasMap: site.social.googleMaps || undefined,
  openingHoursSpecification: openingHours,
  image: [abs('/images/og-default.jpg')],
  logo: { '@type': 'ImageObject', url: abs('/images/logo.png'), width: 512, height: 512 },
  priceRange: 'LKR',
  currenciesAccepted: 'LKR',
  isAccessibleForFree: false,
  sameAs,
  // The suburbs we actually draw families from. Reinforces local relevance for
  // "montessori near me" searches fired from each of these areas.
  areaServed: site.serviceAreas.map((a) => ({
    '@type': 'Place',
    name: `${a}, Sri Lanka`,
  })),
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
    audienceType: 'Children aged 1 to 8 and their parents',
  },
  ...(site.rating.count > 0
    ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: site.rating.value,
          reviewCount: site.rating.count,
          bestRating: '5',
          worstRating: '1',
        },
      }
    : {}),
});

/** Enables the sitelinks search box and names the site as an entity. */
export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': ID.website,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: site.lang,
  publisher: { '@id': ID.school },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: abs('/news?q={search_term_string}') },
    'query-input': 'required name=search_term_string',
  },
});

/** Breadcrumbs render as the path line under your result instead of a raw URL. */
export const breadcrumbSchema = (crumbs: { name: string; href: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: abs(c.href),
  })),
});

/** FAQ blocks can win an expandable rich result — huge for SERP real estate. */
export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

/** One news article / blog post. */
export const articleSchema = (a: {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
  image?: string;
  author?: string;
  category?: string;
}) => ({
  '@type': 'BlogPosting',
  '@id': abs(`/news/${a.slug}#article`),
  headline: a.title.slice(0, 110), // Google truncates past ~110 chars
  description: a.description,
  url: abs(`/news/${a.slug}`),
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/news/${a.slug}`) },
  datePublished: a.publishedAt.toISOString(),
  dateModified: (a.updatedAt ?? a.publishedAt).toISOString(),
  inLanguage: site.lang,
  articleSection: a.category,
  image: [abs(a.image ?? site.ogImage)],
  author: { '@type': 'Person', name: a.author ?? `${site.name} Team` },
  publisher: { '@id': ID.school },
  isPartOf: { '@id': ID.website },
});

/** A programme, expressed as a Course so it can win course rich results. */
export const courseSchema = (c: {
  title: string;
  description: string;
  slug: string;
  ageRange: string;
  schedule?: string;
}) => ({
  '@type': 'Course',
  '@id': abs(`/programmes/${c.slug}#course`),
  name: c.title,
  description: c.description,
  url: abs(`/programmes/${c.slug}`),
  provider: { '@id': ID.school },
  inLanguage: site.lang,
  educationalLevel: 'Early childhood',
  typicalAgeRange: c.ageRange,
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'onsite',
    courseWorkload: c.schedule ?? 'PT3H',
    location: {
      '@type': 'Place',
      name: site.name,
      address: postalAddress,
    },
  },
});

/**
 * Wraps any set of nodes into a single @graph. One script tag per page beats
 * several disconnected ones — nodes can cross-reference by @id.
 */
export const graph = (...nodes: object[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});

export { ID as schemaIds, addressOneLine };
