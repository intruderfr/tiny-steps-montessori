/**
 * Question banks for the knowledge challenges.
 *
 * WHY THESE ARE HAND-WRITTEN
 * Every question is authored rather than generated. A generated question can
 * accidentally have two defensible answers, and telling a child their good
 * reasoning is wrong teaches them to stop reasoning. Each item below has
 * exactly one correct answer and a short `why` that is given after they solve
 * it — the explanation is the actual teaching, not the tick.
 *
 * SHAPE OF THE DATA
 *   bank[stageIndex] = [ variant, variant, ... ]
 * Each stage holds two or three variants so replaying a stage is not identical.
 * Stages run easiest to hardest.
 *
 * ⚠️  FACT-CHECK NOTE for the Sri Lanka bank: these are standard reference
 * facts (national symbols, landmarks, geography). They are worth a glance
 * before launch, since a school publishing a factual error about its own
 * country is worse than publishing nothing.
 */

export interface Question {
  ask: string;
  options: string[];
  answer: string;
  why: string;
  /** Render options as words rather than large glyphs. */
  text?: boolean;
}

export type Bank = Question[][];

/* ========================================================= FIRST SOUNDS === */
/* Phonics. The child has to name the picture in their head, then listen to
   its first sound — which is the step that matters, not letter recognition. */
export const sounds: Bank = [
  [
    { ask: 'Which one starts with the sound "b"?', options: ['🍌', '🍎', '🐱', '🌳'], answer: '🍌', why: 'banana starts with b' },
    { ask: 'Which one starts with the sound "c"?', options: ['🐱', '🐶', '🐟', '🐝'], answer: '🐱', why: 'cat starts with c' },
  ],
  [
    { ask: 'Which one starts with the sound "s"?', options: ['☀️', '🌙', '🍎', '🐶'], answer: '☀️', why: 'sun starts with s' },
    { ask: 'Which one starts with the sound "m"?', options: ['🌙', '⭐', '🐟', '🍏'], answer: '🌙', why: 'moon starts with m' },
  ],
  [
    { ask: 'Which one starts with the sound "t"?', options: ['🌳', '🐝', '🍎', '🐟'], answer: '🌳', why: 'tree starts with t' },
    { ask: 'Which one starts with the sound "f"?', options: ['🐟', '🐸', '🐰', '🐧'], answer: '🐟', why: 'fish starts with f' },
  ],
  [
    { ask: 'Which one ENDS with the sound "g"?', options: ['🐸', '🐱', '🐟', '🐝'], answer: '🐸', why: 'frog ends with g' },
    { ask: 'Which one ENDS with the sound "n"?', options: ['☀️', '🍎', '🐟', '🌳'], answer: '☀️', why: 'sun ends with n' },
  ],
  [
    { ask: 'Which one has the "a" sound in the middle?', options: ['🐱', '🐟', '🌙', '🌳'], answer: '🐱', why: 'c-A-t has a in the middle' },
    { ask: 'Which one has the "i" sound in the middle?', options: ['🐟', '🐸', '🐱', '🐶'], answer: '🐟', why: 'f-I-sh has i in the middle' },
  ],
  [
    { ask: 'Which one rhymes with "log"?', options: ['🐸', '🐱', '🐟', '🐝'], answer: '🐸', why: 'frog and log rhyme' },
    { ask: 'Which one rhymes with "hat"?', options: ['🐱', '🐶', '🐟', '🐝'], answer: '🐱', why: 'cat and hat rhyme' },
  ],
  [
    { ask: 'Which one starts with TWO sounds joined: "fr"?', options: ['🐸', '🐟', '🌳', '🐝'], answer: '🐸', why: 'frog starts with the f and r together' },
    { ask: 'Which one starts with TWO sounds joined: "tr"?', options: ['🌳', '🐱', '🍎', '🐟'], answer: '🌳', why: 'tree starts with the t and r together' },
  ],
  [
    { ask: 'Which word has THREE beats when you clap it?', options: ['banana', 'apple', 'fish', 'tree'], answer: 'banana', why: 'ba-na-na is three claps', text: true },
    { ask: 'Which word has TWO beats when you clap it?', options: ['apple', 'cat', 'elephant', 'sun'], answer: 'apple', why: 'ap-ple is two claps', text: true },
  ],
];

/* ====================================================== SHAPE DETECTIVE === */
export const shapes: Bank = [
  [
    { ask: 'Which one is a circle?', options: ['⚪', '🔺', '🟥', '⬛'], answer: '⚪', why: 'a circle is round all the way' },
    { ask: 'Which one is a square?', options: ['🟥', '⚪', '🔺', '➖'], answer: '🟥', why: 'a square has four equal sides' },
  ],
  [
    { ask: 'Which one is a triangle?', options: ['🔺', '⚪', '🟦', '⬛'], answer: '🔺', why: 'a triangle has three sides' },
    { ask: 'Which one is a star?', options: ['⭐', '⚪', '🟥', '🔺'], answer: '⭐', why: 'a star has points' },
  ],
  [
    { ask: 'How many sides does a triangle have?', options: ['3', '4', '5', '6'], answer: '3', why: 'tri means three', text: true },
    { ask: 'How many sides does a square have?', options: ['4', '3', '5', '8'], answer: '4', why: 'a square has four equal sides', text: true },
  ],
  [
    { ask: 'How many corners does a square have?', options: ['4', '3', '2', '6'], answer: '4', why: 'one corner for each pair of sides that meet', text: true },
    { ask: 'How many corners does a circle have?', options: ['0', '1', '2', '4'], answer: '0', why: 'a circle has no corners at all', text: true },
  ],
  [
    { ask: 'Which shape is round like a ball?', options: ['sphere', 'cube', 'square', 'triangle'], answer: 'sphere', why: 'a sphere is a ball shape', text: true },
    { ask: 'Which shape is a box with six flat faces?', options: ['cube', 'sphere', 'circle', 'cone'], answer: 'cube', why: 'a cube has six square faces', text: true },
  ],
  [
    { ask: 'Which of these can roll?', options: ['⚪', '🟥', '🔺', '⬛'], answer: '⚪', why: 'round things roll; flat sides stop them' },
    { ask: 'Which shape has NO straight sides?', options: ['⚪', '🔺', '🟥', '⬛'], answer: '⚪', why: 'a circle is one curved line' },
  ],
  [
    { ask: 'Which shape has the MOST sides?', options: ['hexagon', 'triangle', 'square', 'pentagon'], answer: 'hexagon', why: 'a hexagon has six sides; a pentagon has five', text: true },
    { ask: 'How many sides does a pentagon have?', options: ['5', '4', '6', '3'], answer: '5', why: 'penta means five', text: true },
  ],
  [
    { ask: 'Which one is NOT a shape with four sides?', options: ['triangle', 'square', 'rectangle', 'rhombus'], answer: 'triangle', why: 'the other three all have four sides', text: true },
    { ask: 'A rectangle and a square both have four sides. What makes a square special?', options: ['all sides equal', 'it is bigger', 'it is red', 'it has no corners'], answer: 'all sides equal', why: 'a square is a rectangle with every side the same length', text: true },
  ],
];

/* ========================================================= MY SRI LANKA === */
/* Local general knowledge. No competitor site has anything like this, and it
   is the kind of thing a Sri Lankan parent will actually want their child on. */
export const lanka: Bank = [
  [
    { ask: 'Which animal is the biggest one living wild in Sri Lanka?', options: ['🐘', '🐿️', '🐇', '🐈'], answer: '🐘', why: 'the Sri Lankan elephant is our largest wild animal' },
    { ask: 'Which of these lives wild in Sri Lanka?', options: ['🐘', '🐧', '🐨', '🦒'], answer: '🐘', why: 'penguins, koalas and giraffes do not live here' },
  ],
  [
    { ask: 'Which of these grows in Sri Lanka?', options: ['🥥', '🍁', '🌵', '🍄'], answer: '🥥', why: 'coconut palms grow all over the island' },
    { ask: 'Which fruit is famous in Sri Lanka?', options: ['🍍', '🍒', '🫐', '🥝'], answer: '🍍', why: 'pineapple grows well in our climate' },
  ],
  [
    { ask: 'What is the sea around Sri Lanka called?', options: ['Indian Ocean', 'Atlantic Ocean', 'Pacific Ocean', 'Arctic Ocean'], answer: 'Indian Ocean', why: 'Sri Lanka is an island in the Indian Ocean', text: true },
    { ask: 'Sri Lanka is an island. What does that mean?', options: ['water all around', 'very cold', 'no trees', 'joined to India'], answer: 'water all around', why: 'an island has sea on every side', text: true },
  ],
  [
    { ask: 'Which is the largest city in Sri Lanka?', options: ['Colombo', 'Kandy', 'Galle', 'Jaffna'], answer: 'Colombo', why: 'Colombo is our largest city and commercial capital', text: true },
    { ask: 'Which city is famous for its lake and the Temple of the Tooth?', options: ['Kandy', 'Colombo', 'Galle', 'Negombo'], answer: 'Kandy', why: 'the Temple of the Sacred Tooth Relic is in Kandy', text: true },
  ],
  [
    { ask: 'Which drink is Sri Lanka famous for growing?', options: ['tea', 'coffee', 'cocoa', 'orange juice'], answer: 'tea', why: 'Ceylon tea is grown in our hill country and sold worldwide', text: true },
    { ask: 'Where is tea grown in Sri Lanka?', options: ['the hills', 'the sea', 'the desert', 'the city'], answer: 'the hills', why: 'tea grows best in the cool hill country', text: true },
  ],
  [
    { ask: 'Which festival is the Sinhala and Tamil New Year?', options: ['Avurudu', 'Vesak', 'Deepavali', 'Christmas'], answer: 'Avurudu', why: 'Avurudu is our New Year, in April', text: true },
    { ask: 'At which festival are lanterns made and hung up?', options: ['Vesak', 'Avurudu', 'Deepavali', 'Eid'], answer: 'Vesak', why: 'Vesak lanterns light up the whole country', text: true },
  ],
  [
    { ask: 'Which famous rock fortress has a lion carved at its entrance?', options: ['Sigiriya', 'Adam’s Peak', 'Ella', 'Mirissa'], answer: 'Sigiriya', why: 'Sigiriya means Lion Rock', text: true },
    { ask: 'Which of these is a famous mountain people climb before sunrise?', options: ['Adam’s Peak', 'Sigiriya', 'Galle Fort', 'Negombo'], answer: 'Adam’s Peak', why: 'Adam’s Peak, or Sri Pada, is climbed at night to see the sunrise', text: true },
  ],
  [
    { ask: 'What is the national flower of Sri Lanka?', options: ['blue water lily', 'rose', 'sunflower', 'jasmine'], answer: 'blue water lily', why: 'the blue water lily, Nil Manel, is our national flower', text: true },
    { ask: 'Which big cat lives wild in Sri Lanka?', options: ['leopard', 'lion', 'tiger', 'cheetah'], answer: 'leopard', why: 'the Sri Lankan leopard is found in our national parks', text: true },
  ],
];

export const BANKS: Record<string, Bank> = { sounds, shapes, lanka };
