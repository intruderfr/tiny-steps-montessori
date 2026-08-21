/**
 * Gallery metadata for the school's own photographs.
 *
 * Alt text here is written from what is actually in each frame, not from the
 * filename. That matters twice over: screen-reader users get a real
 * description, and Google Images is a genuine traffic source for a local
 * school — "montessori dehiwala" image results are how a lot of parents form a
 * first impression.
 *
 * ⚠️  CONSENT: every one of these shows identifiable children. The site's own
 * privacy policy promises no child's photograph is published without specific
 * written parental consent. Confirm you hold that consent for each child shown
 * before this goes live on a public domain. See CONTENT-CHECKLIST.md.
 */

export type GalleryCategory =
  | 'Classroom'
  | 'Science & STEM'
  | 'Outdoors & Trips'
  | 'Celebrations'
  | 'Art & Craft';

export interface Photo {
  /** Matches the filename in src/assets/photos (without .jpg). */
  slug: string;
  alt: string;
  /** Shown under the image in the gallery. Optional. */
  caption?: string;
  category: GalleryCategory;
  /** Surface earlier in the gallery and eligible for use on other pages. */
  featured?: boolean;
}

export const photos: Photo[] = [
  // ------------------------------------------------------------- classroom
  {
    slug: 'morning-assembly-classroom',
    alt: 'A full classroom of children in Tiny Steps green uniforms standing together at morning assembly',
    caption: 'Morning assembly, before the work cycle begins',
    category: 'Classroom',
    featured: true,
  },
  {
    slug: 'practical-life-pouring',
    alt: 'Two young children carefully pouring water between small green cups at a low table',
    caption: 'Pouring — the practical life work that builds concentration and hand control',
    category: 'Classroom',
    featured: true,
  },
  {
    slug: 'practical-life-watering-plant',
    alt: 'A child watering a potted plant with a small orange watering can',
    caption: 'Caring for the classroom plants is a daily job the children own',
    category: 'Classroom',
  },
  {
    slug: 'threading-beads',
    alt: 'A child concentrating on threading coloured beads onto a string at a table',
    caption: 'Threading beads — fine motor control, and the grip that writing later needs',
    category: 'Classroom',
  },
  {
    slug: 'sorting-and-matching',
    alt: 'A child sorting small coloured objects into a tray in the classroom',
    caption: 'Sorting and matching work',
    category: 'Classroom',
  },
  {
    slug: 'colouring-world-maps',
    alt: 'Two children colouring in outline maps of the world with blue crayons',
    caption: 'Culture work: colouring the continents',
    category: 'Classroom',
  },
  {
    slug: 'role-play-kitchen-corner',
    alt: 'A child playing with pots and toy food in the classroom role-play kitchen',
    caption: 'The role-play kitchen, where a lot of early language happens',
    category: 'Classroom',
  },
  {
    slug: 'classroom-free-play',
    alt: 'Children playing together with toys on a rug in a bright classroom',
    category: 'Classroom',
  },
  {
    slug: 'toddler-water-play',
    alt: 'Toddlers sitting on the floor playing with basins of water and plastic cups',
    caption: 'Water play for our youngest children',
    category: 'Classroom',
  },
  {
    slug: 'toddler-washing-basin',
    alt: 'A young child washing their hands in a large basin of soapy water outdoors',
    category: 'Classroom',
  },
  {
    slug: 'water-basins-outdoors',
    alt: 'A group of children sitting in a circle outdoors, each with their own basin of water',
    caption: 'Everyone gets their own basin — no waiting, no queue',
    category: 'Classroom',
  },

  // -------------------------------------------------------- science & STEM
  {
    slug: 'stem-club-building-circuits',
    alt: 'Children in STEM Club connecting wires to a battery pack and switch on a table',
    caption: 'STEM Club: building a working circuit from scratch',
    category: 'Science & STEM',
    featured: true,
  },
  {
    slug: 'stem-club-wiring-a-switch',
    alt: 'Two children carefully wiring a small switch while a teacher steadies the board',
    caption: 'The moment the bulb finally lights is the whole lesson',
    category: 'Science & STEM',
  },
  {
    slug: 'stem-club-circuits-table',
    alt: 'A row of completed circuit boards built by children, laid out on a green table',
    caption: 'Every child finishes with something they built and can take home',
    category: 'Science & STEM',
  },
  {
    slug: 'science-sink-and-float',
    alt: 'Children testing objects in water beside handwritten Sink and Float labels',
    caption: 'Sink or float? Predict first, then test — that is the science part',
    category: 'Science & STEM',
    featured: true,
  },

  // ------------------------------------------------------ outdoors & trips
  {
    slug: 'nature-trip-paddy-field',
    alt: 'A large group of children wading through a muddy paddy field on a nature trip',
    caption: 'Our paddy field trip — boots off, straight in',
    category: 'Outdoors & Trips',
    featured: true,
  },
  {
    slug: 'nature-trip-mud-play',
    alt: 'Children playing and digging in thick mud at the edge of a paddy field',
    caption: 'Mud is a material, and children learn an enormous amount from it',
    category: 'Outdoors & Trips',
  },
  {
    slug: 'nature-trip-muddy-child',
    alt: 'A child covered head to toe in dried mud, standing and grinning at the camera',
    caption: 'This is what a good day out looks like',
    category: 'Outdoors & Trips',
    featured: true,
  },
  {
    slug: 'farm-visit-holding-chick',
    alt: 'Children in green uniforms gathered around a baby chick held in cupped hands',
    caption: 'Meeting a day-old chick on our farm visit',
    category: 'Outdoors & Trips',
    featured: true,
  },
  {
    slug: 'farm-visit-hen-on-hat',
    alt: 'A small child wearing a straw hat with a white hen perched on top of it',
    caption: 'Not every child expected the hen to sit on their head',
    category: 'Outdoors & Trips',
  },
  {
    slug: 'farm-visit-meeting-animals',
    alt: 'A group of children reaching out to stroke a small animal held by an adult',
    category: 'Outdoors & Trips',
  },
  {
    slug: 'field-trip-under-the-trees',
    alt: 'The whole school gathered outdoors under coconut trees during a walking trip',
    category: 'Outdoors & Trips',
  },
  {
    slug: 'field-trip-group-dehiwala',
    alt: 'Children lined up in green uniforms outside a building during a community walk in Dehiwala',
    caption: 'Walking trips around Dehiwala are part of our culture work',
    category: 'Outdoors & Trips',
  },
  {
    slug: 'ice-cream-outing',
    alt: 'A child buying an ice cream from a blue ice cream cart with a teacher nearby',
    caption: 'Handling your own money at the ice cream cart is real practical life',
    category: 'Outdoors & Trips',
  },
  {
    slug: 'playground-whole-school',
    alt: 'A large group of children and teachers gathered together in the school playground',
    category: 'Outdoors & Trips',
  },

  // ---------------------------------------------------------- celebrations
  {
    slug: 'international-day-asia',
    alt: 'Children on a decorated stage representing Asia at the school International Day concert',
    caption: 'International Day: the Asia stage',
    category: 'Celebrations',
    featured: true,
  },
  {
    slug: 'international-day-africa',
    alt: 'Children in costume on a thatched Africa-themed stage at the International Day concert',
    caption: 'International Day: the Africa stage',
    category: 'Celebrations',
  },
  {
    slug: 'international-day-britain',
    alt: 'Children dressed as guardsmen beside a painted castle set at the International Day concert',
    caption: 'International Day: the Britain stage',
    category: 'Celebrations',
  },
  {
    slug: 'avurudu-new-year-group',
    alt: 'A large group of children in traditional Sri Lankan dress for the Avurudu New Year celebration',
    caption: 'Sinhala and Tamil New Year at Tiny Steps',
    category: 'Celebrations',
    featured: true,
  },
  {
    slug: 'avurudu-new-year-stage',
    alt: 'Children in traditional dress standing in front of a decorated Avurudu New Year backdrop',
    category: 'Celebrations',
  },
  {
    slug: 'career-day-pilots',
    alt: 'Four children dressed as airline pilots in uniform and caps for Career Day',
    caption: 'Career Day — the pilots',
    category: 'Celebrations',
  },
  {
    slug: 'career-day-community-helpers',
    alt: 'Children dressed as community helpers including a sailor and a road worker for Career Day',
    caption: 'Career Day — community helpers',
    category: 'Celebrations',
  },
  {
    slug: 'career-day-dress-up',
    alt: 'Children in a variety of dress-up costumes posing together on Career Day',
    category: 'Celebrations',
  },
  {
    slug: 'cookery-day-display',
    alt: 'The Cookery Day display table with prepared dishes and children in aprons and chef hats',
    caption: 'Cookery Day, and the children did the cooking',
    category: 'Celebrations',
  },

  // ----------------------------------------------------------- art & craft
  {
    slug: 'upcycling-painting-tyres',
    alt: 'Children painting an old car tyre bright green as part of a playground upcycling project',
    caption: 'Turning old tyres into playground equipment',
    category: 'Art & Craft',
    featured: true,
  },
  {
    slug: 'upcycling-red-tyre',
    alt: 'Three children painting a car tyre red on a sheet of newspaper on the floor',
    category: 'Art & Craft',
  },
  {
    slug: 'art-fish-collage',
    alt: 'A child smiling and holding up a circular fish collage they made from coloured pom-poms',
    caption: 'Under the sea, made from pom-poms and card',
    category: 'Art & Craft',
  },
  {
    slug: 'art-fish-puppet',
    alt: 'A child holding a large paper fish puppet with rainbow scales they made in the art corner',
    category: 'Art & Craft',
  },
];

export const categories: GalleryCategory[] = [
  'Classroom',
  'Science & STEM',
  'Outdoors & Trips',
  'Celebrations',
  'Art & Craft',
];

/** Look one up by slug — used when a page wants a specific photo. */
export const photoBySlug = (slug: string) => photos.find((p) => p.slug === slug);

/**
 * Short clips of the school day.
 * Posters are generated by scripts/make-posters.mjs so the video never has to
 * download before something is visible.
 */
export const videos = [
  {
    src: '/videos/school-life-1.mp4',
    poster: '/videos/school-life-1-poster.jpg',
    // Intrinsic dimensions, so the browser reserves the right box and the page
    // does not shift when the poster loads.
    width: 848,
    height: 478,
    duration: 14,
    title: 'Avurudu tug-of-war',
    description:
      'Children in traditional dress playing tug-of-war during our Sinhala and Tamil New Year celebration.',
  },
  {
    src: '/videos/school-life-2.mp4',
    poster: '/videos/school-life-2-poster.jpg',
    width: 478,
    height: 850,
    duration: 14,
    title: 'New Year games with the families',
    description:
      'Teachers and parents running Avurudu games with the children at the school.',
  },
];
