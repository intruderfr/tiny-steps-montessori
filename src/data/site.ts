/**
 * SINGLE SOURCE OF TRUTH for the whole site.
 *
 * Local SEO depends on NAP (Name / Address / Phone) being byte-identical across
 * your website, your Google Business Profile and every directory listing.
 * Everything on the site — headers, footers, contact page, JSON-LD structured
 * data, sitemap — reads from this file, so you can never drift out of sync.
 *
 * ⚠️  ITEMS MARKED `VERIFY:` ARE ASSUMPTIONS — confirm them before you go live.
 */

/**
 * Where the site is deployed. Both values are injected at build time by
 * astro.config.mjs (see its `vite.define` block) so canonical URLs, JSON-LD
 * @id values and the sitemap can never disagree with the real deployment.
 *
 * ORIGIN — scheme + host, no trailing slash.  "https://tinystepsmontessori.lk"
 * BASE   — sub-path, or "" when served from the domain root.  "/tiny-steps"
 */
export const ORIGIN = (import.meta.env.SITE_ORIGIN || 'https://tinystepsmontessori.lk').replace(
  /\/+$/,
  ''
);
export const BASE = import.meta.env.SITE_BASE || '';

export const site = {
  // ---------------------------------------------------------------- identity
  name: 'Tiny Steps Montessori',
  legalName: 'Tiny Steps Montessori',
  shortName: 'Tiny Steps',
  tagline: 'Stepping Towards a Brighter Future',
  founded: '2018', // VERIFY: year the school opened
  /** Public home page URL, base path included. */
  url: ORIGIN + BASE,

  description:
    'Tiny Steps Montessori is a warm, child-led Montessori preschool and daycare in Dehiwala, Colombo. Playgroup, Montessori and STEM programmes for children aged 1 to 8, with qualified teachers and small class sizes.',

  // ------------------------------------------------------------- NAP (exact)
  address: {
    street: '43A, Srimal Avenue, Off Galvihara Road',
    locality: 'Dehiwala-Mount Lavinia',
    region: 'Western Province',
    postalCode: '10350',
    country: 'LK',
    countryName: 'Sri Lanka',
  },
  // VERIFY: drop a pin on Google Maps, right-click → copy the exact lat/long.
  geo: { latitude: 6.8531, longitude: 79.8721 },

  phone: '+94 77 787 5009',
  phoneHref: 'tel:+94777875009',
  whatsapp: '94777875009', // same number, digits only, for wa.me links
  email: 'tinystepsmontessorisl@gmail.com',

  // ------------------------------------------------------------------- hours
  // VERIFY: these must match your Google Business Profile hours exactly.
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  ],
  hoursHuman: [
    { label: 'Monday – Friday', value: '8:00 AM – 5:00 PM' },
    { label: 'Saturday', value: 'By appointment' },
    { label: 'Sunday', value: 'Closed' },
  ],

  // ----------------------------------------------------------------- socials
  social: {
    facebook: 'https://www.facebook.com/tinystepsmontessori', // VERIFY exact handle
    instagram: 'https://www.instagram.com/tiny_steps_montessori',
    youtube: '', // add when you have one — video is a strong ranking + trust signal
    googleMaps: 'https://maps.app.goo.gl/', // VERIFY: paste your GBP "Share" short link
    googleReviews: 'https://g.page/r/', // VERIFY: GBP → Ask for reviews → copy link
  },

  // ------------------------------------------------------- trust / proof
  rating: { value: '5.0', count: 6 }, // VERIFY: keep in sync with your real review count

  // ------------------------------------------------ service area (local SEO)
  // These power the "Areas we serve" block and the location landing pages.
  serviceAreas: [
    'Dehiwala',
    'Mount Lavinia',
    'Ratmalana',
    'Nedimala',
    'Kalubowila',
    'Wellawatte',
    'Kohuwala',
    'Attidiya',
  ],

  // --------------------------------------------------------------- defaults
  locale: 'en_LK',
  lang: 'en-LK',
  themeColor: '#1C9BC7', // the logo ribbon teal
  ogImage: '/images/og-default.jpg',
} as const;

/** One-line address, used in footers and inline copy. Never hand-type this. */
export const addressOneLine = `${site.address.street}, ${site.address.locality} ${site.address.postalCode}, ${site.address.countryName}`;

/** Canonical absolute URL builder. */
/**
 * Absolute URL for a path you wrote by hand, e.g. abs('/news') or
 * abs('/images/og-default.jpg'). Adds the base path for you.
 */
export const abs = (path = '/') => {
  const p = path === '/' ? '/' : `/${path.replace(/^\/+/, '')}`;
  return ORIGIN + BASE + (p === '/' ? '/' : p);
};

/**
 * Absolute URL for a pathname taken from `Astro.url`, which ALREADY carries the
 * base path. Passing one of those to abs() would prepend the base a second time
 * and produce /repo/repo/page — so canonicals must use this instead.
 */
export const absFromPathname = (pathname: string) =>
  ORIGIN + (pathname.startsWith('/') ? pathname : `/${pathname}`);

/** True when the given Astro pathname is the site's home page. */
export const isHomePath = (pathname: string) =>
  pathname.replace(/\/+$/, '') === BASE.replace(/\/+$/, '');

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Programmes',
    href: '/programmes',
    children: [
      { label: 'Playgroup (1–2 yrs)', href: '/programmes/playgroup' },
      { label: 'Montessori (2–5 yrs)', href: '/programmes/montessori' },
      { label: 'STEM Club (5–8 yrs)', href: '/programmes/stem' },
      { label: 'Daycare & After-School', href: '/programmes/daycare' },
    ],
  },
  { label: 'Admissions', href: '/admissions' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];
