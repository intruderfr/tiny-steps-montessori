/**
 * Per-suburb content for the location landing pages.
 *
 * ⚠️  A WORD OF WARNING ABOUT THIS PATTERN.
 * Location pages work brilliantly for local SEO *when each one says something
 * genuinely different and useful*. If you copy one page eight times and swap the
 * suburb name, Google classifies them as "doorway pages" and they can drag the
 * whole domain down. So every entry below carries its own route notes, landmarks
 * and angle, and the page template leans on them heavily.
 *
 * ⚠️  VERIFY the travel times and landmarks before launch — they are estimates
 * from map data, not from driving it at 7:45 AM on a Monday. Drive each one.
 */

export interface Area {
  /** URL slug fragment: /montessori-preschool-<slug> */
  slug: string;
  name: string;
  /** Approximate drive time from the school in normal traffic. VERIFY. */
  driveTime: string;
  /** Approximate distance. VERIFY. */
  distance: string;
  /** One sentence on how families from here usually reach us. */
  route: string;
  /** Recognisable places nearby — helps a local reader orient instantly. */
  landmarks: string[];
  /** The genuinely different thing to say to a parent from this suburb. */
  angle: string;
}

export const areas: Area[] = [
  {
    slug: 'dehiwala',
    name: 'Dehiwala',
    driveTime: '3–8 minutes',
    distance: 'Under 2 km',
    route:
      'We are in Dehiwala itself, just off Galvihara Road on Srimal Avenue — close enough that most Dehiwala families walk or make a very short drive.',
    landmarks: ['Dehiwala Zoo', 'Hill Street', 'Dehiwala railway station', 'Galle Road junction'],
    angle:
      'If you live in Dehiwala, we are your local Montessori school. That matters more than it sounds: a short journey means your child is not already tired and fractious before the day starts, and it means you can be here in minutes if they are unwell.',
  },
  {
    slug: 'mount-lavinia',
    name: 'Mount Lavinia',
    driveTime: '8–15 minutes',
    distance: 'About 3 km',
    route:
      'Most Mount Lavinia families come up Galle Road and turn inland at Dehiwala, or take Hotel Road and cut across. Both avoid the worst of the morning coast-road queue.',
    landmarks: ['Mount Lavinia Hotel', 'Mount Lavinia beach', 'Hotel Road', 'Mount Lavinia station'],
    angle:
      'Mount Lavinia parents usually tell us the same thing: they wanted somewhere that was not on Galle Road. Being a few streets inland means a quieter, less polluted setting, and a drop-off that does not involve pulling out into coastal traffic.',
  },
  {
    slug: 'ratmalana',
    name: 'Ratmalana',
    driveTime: '12–20 minutes',
    distance: 'About 5 km',
    route:
      'Galle Road north through Mount Lavinia, then inland at Dehiwala. Families heading into Colombo for work often find dropping off here first is on the way rather than a detour.',
    landmarks: ['Ratmalana Airport', 'Attidiya Road', 'Ratmalana railway station'],
    angle:
      'For Ratmalana families, the deciding factor is usually the commute. If you work in Colombo 1–3, Tiny Steps sits on your route rather than against it, and our daycare to 5:00 PM means you are not racing back for a midday pickup.',
  },
  {
    slug: 'nedimala',
    name: 'Nedimala',
    driveTime: '5–10 minutes',
    distance: 'About 2 km',
    route:
      'A short run down through Dehiwala. Nedimala families avoid Galle Road entirely, which on a weekday morning is worth a great deal.',
    landmarks: ['Nedimala junction', 'Dehiwala–Maharagama Road', 'Kawdana Road'],
    angle:
      'Nedimala is close enough that several of our families do the school run on foot or by tuk in under ten minutes, without touching a main road. If you are weighing us against a school further into Colombo, the daily difference is significant.',
  },
  {
    slug: 'kalubowila',
    name: 'Kalubowila',
    driveTime: '6–12 minutes',
    distance: 'About 2.5 km',
    route:
      'Down Hospital Road and across into Dehiwala. A straightforward run that avoids the Galle Road bottleneck.',
    landmarks: ['Colombo South Teaching Hospital', 'Hospital Road', 'S. de S. Jayasinghe Mawatha'],
    angle:
      'We have a number of families from Kalubowila who work in healthcare, on shifts that do not fit a 12:30 pickup. Our daycare runs to 5:00 PM with the same familiar staff, and we take occasional days when a rota changes at short notice.',
  },
  {
    slug: 'wellawatte',
    name: 'Wellawatte',
    driveTime: '10–18 minutes',
    distance: 'About 4 km',
    route:
      'South along Galle Road, then inland at Dehiwala. Slightly longer against the morning flow, but noticeably quicker on the way home.',
    landmarks: ['Wellawatte Marine Drive', 'Savoy Cinema', 'Galle Road, Colombo 6'],
    angle:
      'Wellawatte families are usually choosing between staying in Colombo 6 and coming slightly south for more space. What we offer that a Colombo 6 apartment-block preschool often cannot is a real garden that children are in every single day.',
  },
  {
    slug: 'kohuwala',
    name: 'Kohuwala',
    driveTime: '8–14 minutes',
    distance: 'About 3 km',
    route:
      'Along Dutugemunu Street and down through Nedimala into Dehiwala — an inland route that skips Galle Road completely.',
    landmarks: ['Kohuwala junction', 'Dutugemunu Street', 'Nugegoda border'],
    angle:
      'Kohuwala sits between several preschool options, so parents here tend to compare carefully. The two questions we would want answered in your position are the adult-to-child ratio in each room, and how long the teachers have stayed. We publish both.',
  },
  {
    slug: 'attidiya',
    name: 'Attidiya',
    driveTime: '8–15 minutes',
    distance: 'About 3.5 km',
    route:
      'Up Attidiya Road into Dehiwala. A short, mostly residential run that keeps you off the main coastal artery.',
    landmarks: ['Attidiya Bird Sanctuary', 'Attidiya Road', 'Dehiwala marshes'],
    angle:
      'Families from Attidiya often care about outdoor time — you live beside a bird sanctuary, after all. Our children are in the garden every day without exception, and our STEM Club spends a good part of its year on living things: growing, observing, dissecting a flower properly under a loupe.',
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
