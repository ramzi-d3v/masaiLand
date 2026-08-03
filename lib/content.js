/*
  All copy and figures below are taken from masailandsafari.com. Voice and
  substance are preserved; long paragraphs are condensed for the new layout.
  Nav labels and route slugs are unchanged so existing links and rankings hold.
*/

export const site = {
  name: "Masailand Safari & Lodge",
  tagline: "Where elegance meets nature",
  address: "Arumeru, Arusha, 1531, Tanzania",
  tel: "+255 624 71 20 20",
  telHref: "+255624712020",
  fax: "+255 624 72 20 20",
  email: "info@masailandsafari.com",
  instagram: "https://www.instagram.com/masailandsafarilodge/",
  parent: "The Travelbook Group",
};

/*
  The exact six marks the current masailandsafari.com runs in its own
  pre-footer carousel, in the same order. width/height are the source
  files' real pixel dimensions, so each logo's slot uses its own aspect
  ratio rather than being letterboxed inside a uniform box.
*/
export const trustLogos = [
  { src: "tripadvisor-logo", alt: "Tripadvisor", width: 600, height: 338 },
  { src: "tanzania", alt: "Tanzania National Parks", width: 225, height: 225 },
  { src: "zato", alt: "ZATO", width: 575, height: 469 },
  { src: "new-zato", alt: "ZATO (updated mark)", width: 225, height: 225 },
  { src: "logo-masailand", alt: "Masailand Safari & Lodge", width: 300, height: 189 },
  { src: "deal6", alt: "Safari Deal", width: 600, height: 401 },
];

export const nav = [
  { label: "Rooms & Suites", href: "/rooms-suites" },
  { label: "Wine & Dine", href: "/wine-dine" },
  { label: "Conferences & Events", href: "/conferences" },
  { label: "Wellness", href: "/wellness" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

/*
  The same six destinations, with the three that have real sub-pages opened up
  into panels. Each panel item carries a photograph and the one fact a guest
  actually chooses on: room size, hall capacity, opening hours.
*/
export const navMenu = [
  {
    label: "Rooms & Suites",
    href: "/rooms-suites",
    footer: { lead: "Booking for a group?", cta: "Ask about rates", href: "/contact" },
    items: [
      {
        label: "Deluxe Room",
        href: "/rooms-suites#deluxe",
        description: "Queen bed and ensuite, 16.8 sqm. Sleeps two adults and a child.",
        img: "deluxe-room-single-or-double-2",
      },
      {
        label: "Executive Suite",
        href: "/rooms-suites#executive",
        description: "A lounge that closes off and a large balcony, 133 sqm.",
        img: "executive-suite-sitting-2",
      },
      {
        label: "Family & Interconnecting",
        href: "/rooms-suites#family",
        description: "Two rooms joined by a door that locks from both sides.",
        img: "triple-bedroom",
      },
      {
        label: "Cottages and gardens",
        href: "/gallery",
        description: "Nine cottages set among the lawns and flowering trees.",
        img: "masailand-cottages",
      },
    ],
  },
  {
    label: "Conferences & Events",
    href: "/conferences",
    footer: { lead: "Need the full equipment list?", cta: "See what is included", href: "/conferences" },
    items: [
      {
        label: "Tarangire Hall",
        href: "/conferences#tarangire",
        description: "Board meetings and small working groups. Ten seats.",
        img: "tarangire-conference-hall-1",
      },
      {
        label: "Serengeti Hall",
        href: "/conferences#serengeti",
        description: "Press centres and working groups. Twenty seats, U shape.",
        img: "serengeti-conference-hall-1",
      },
      {
        label: "Manyara Hall",
        href: "/conferences#manyara",
        description: "Conferences and safari briefings. Seventy seats, classroom.",
        img: "lake-manyara-conference-hall-1",
      },
      {
        label: "Selous Hall",
        href: "/conferences#selous",
        description: "The largest room, and receptions of every kind. 150 seats.",
        img: "selous-conference-hall-1",
      },
    ],
  },
  {
    label: "Wellness",
    href: "/wellness",
    footer: { lead: "All of it free to residents.", cta: "See opening hours", href: "/wellness" },
    items: [
      {
        label: "Lodge and garden pools",
        href: "/wellness#pools",
        description: "Loungers and towels, open 06:00 to 18:00 seven days.",
        img: "back-1",
      },
      {
        label: "Masailand Spa",
        href: "/wellness#spa",
        description: "Deep tissue and facial massage, body scrubs, steam and sauna.",
        img: "spa",
      },
      {
        label: "Gym",
        href: "/wellness#gym",
        description: "Free weights, treadmills and cycles, looking out on the garden.",
        img: "fitness-at-masai-land-safari-lodge",
      },
      {
        label: "The gardens",
        href: "/gallery",
        description: "Lawns, a fire pit and the outdoor bar under thatch.",
        img: "outdoor-bar",
      },
    ],
  },
];

/* Destinations without a panel of their own. */
export const navPlain = [
  { label: "Wine & Dine", href: "/wine-dine" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

/* The lodge sells its position first. These are the figures the property
   publishes, and they drive the circuit dial on the homepage. */
export const circuit = [
  {
    name: "Kilimanjaro International Airport",
    distance: 45,
    unit: "min",
    km: 50,
    note: "By road, door to door",
  },
  { name: "Mount Kilimanjaro", distance: 116.5, unit: "km", km: 116.5, note: "Africa's highest peak" },
  { name: "Ngorongoro Crater", distance: 191, unit: "km", km: 191, note: "The caldera floor" },
  { name: "Serengeti", distance: 348, unit: "km", km: 348, note: "The migration plains" },
];

/* Hero slides. Each one opens a different part of the property and links to
   the page that carries it, so the slider is navigation rather than a reel. */
export const heroSlides = [
  {
    img: "kisongo-valleys-view",
    alt: "The pool terrace looking out over the Kisongo valleys towards the hills",
    titleA: "A hill above Arusha,",
    titleB: { pre: "with Meru on the ", em: "horizon." },
    sub: "Nine cottages and fifty four rooms outside Arusha, 45 minutes from Kilimanjaro International Airport.",
    place: "The Kisongo valleys",
    desc: "Mount Meru to the east, the valleys running out flat below.",
    href: "/gallery",
  },
  {
    img: "executive-suite-sitting-room-1",
    alt: "Sitting room of an executive suite, finished in warm terracotta with teak furniture",
    titleA: "Fifty four rooms,",
    titleB: { pre: "each with its own ", em: "balcony." },
    sub: "Deluxe rooms, executive suites with a private lounge, and family rooms that interconnect.",
    place: "Rooms & Suites",
    desc: "Eighteen executive suites take in both the sunrise and the sunset.",
    href: "/rooms-suites",
  },
  {
    img: "wine-and-dinner2",
    alt: "Guests raising a toast at the bar in the evening",
    titleA: "Dinner arrives",
    titleB: { pre: "with the ", em: "sunset." },
    sub: "Indoor and poolside dining, with a menu that runs from Tanzanian cooking to international plates.",
    place: "Wine & Dine",
    desc: "The Conservatory faces west, so the light lands on the table.",
    href: "/wine-dine",
  },
  {
    img: "garden-pool-1",
    alt: "The garden swimming pool with sun loungers and parasols",
    titleA: "Two pools, a spa,",
    titleB: { pre: "and a ", em: "gym" , post: " facing the garden." },
    sub: "Swim, steam and train between drives. The lodge pool is free to residents, seven days a week.",
    place: "Wellness",
    desc: "Deep tissue massage, a steam bath and sauna, and free weights.",
    href: "/wellness",
  },
];

/*
  NOTE: the current masailandsafari.com publishes 54 rooms, 18 executive
  suites and 9 cottages. These figures were raised on request. Confirm the real
  capacity with the property before this goes live.
*/
export const property = [
  { value: 200, suffix: "+", label: "rooms" },
  { value: 36, suffix: "", label: "executive suites" },
  { value: 18, suffix: "", label: "cottages" },
  { value: 8, suffix: "", label: "conference halls" },
];

/*
  The strip that runs under the invitation. Eight frames, enough breadth that
  the loop does not read as a loop, drawn from every part of the property.
*/
export const strip = [
  { src: "hotel-front-view-1", alt: "The lodge entrance behind clipped topiary and palms" },
  { src: "executive-suite-sitting-2", alt: "The lounge of an executive suite" },
  { src: "garden-pool-1", alt: "The garden pool with loungers and parasols" },
  { src: "masailand-farm-3", alt: "A chef cutting greens in the lodge's vegetable garden" },
  { src: "reception-2", alt: "The curved marble staircase in the lobby" },
  { src: "spa", alt: "A treatment room at the Masailand spa" },
  { src: "masailand-cottages", alt: "Cottages set among the gardens" },
  { src: "restaurant", alt: "Dishes on the buffet line at the restaurant" },
];

/* The three facts that decide whether the lodge works as a base. */
export const positionChips = [
  { icon: "airplane", label: "45 min from KIA" },
  { icon: "car", label: "3 hr from Nairobi" },
  { icon: "mountains", label: "Mount Meru views" },
];

export const about = {
  label: "About Masailand",
  statement:
    "Masailand rests at the top of a hill outside Arusha, nine cottages wrapped in lawns and flowering trees, with Mount Meru filling the horizon to the east.",
  body: "Every one of the 54 rooms opens onto a balcony, and the 18 executive suites take in both the sunrise and the sunset from theirs.",
  feature: {
    image: "layout-1",
    title: "The hilltop",
    alt: "The lodge and its cottages seen from the air, set among trees on the hill",
  },
  fan: ["garden-pool-1", "executive-suite-sitting-2", "masailand-cottages"],
  fanCaption:
    "The gardens, the cottages and the pools, shot around the property.",
};

/*
  NOTE: `price` on rooms and halls below is illustrative, not a published
  rate. masailandsafari.com quotes nothing in numbers; real pricing runs
  through a booking engine or a phone call. These figures exist so the
  price-card carousel has something to show, and need the property's actual
  rate card before this goes live.
*/
export const rooms = [
  {
    slug: "deluxe",
    name: "Deluxe Room",
    count: 36,
    price: 95,
    priceUnit: "night",
    area: "16.8 sqm",
    sleepsShort: "2 adults",
    sleeps: "Up to 2 adults and 1 child",
    views: "Garden view",
    lead: "Comfort and style in a generously spacious room, suited to couples, single travellers, and families with young children.",
    body: "Each room has a queen size bed and an ensuite bathroom, and takes a cot for young children. Double glazed windows keep the room quiet.",
    images: [
      "deluxe-room-single-or-double-2",
      "deluxe-rooms-twin-2",
      "balcony",
      "deluxe-room-bathroom-2",
    ],
  },
  {
    slug: "executive",
    name: "Executive Suite",
    count: 18,
    price: 180,
    priceUnit: "night",
    area: "133 sqm",
    sleepsShort: "4 adults",
    sleeps: "Up to 4 adults and children",
    views: "Mount Meru, sunrise and sunset",
    lead: "Space and a large private balcony looking out over the plantations, with a lounge that closes off from the bedroom.",
    body: "Warm wooden furnishings, one double bed and two singles. Ideal for families with older children, and for couples who want the extra room.",
    images: [
      "executive-suite-sitting-2",
      "executive-suite-twin-2",
      "executive-suite-sitting-room-2-1",
      "executive-suite-bathroom-2",
    ],
  },
  {
    slug: "family",
    name: "Family & Interconnecting Room",
    count: null,
    price: 260,
    priceUnit: "night",
    area: "133 to 266 sqm",
    sleepsShort: "8 adults",
    sleeps: "Up to 8 adults",
    views: "Mount Meru, sunrise and sunset",
    lead: "Two full rooms joined by a connecting door that locks from both sides, giving children their own space next to yours.",
    body: "Each side has its own bathroom and full room facilities. Built for extended families and for small groups travelling together.",
    images: [
      "triple-bedroom",
      "executive-suite-single-or-double-2",
      "triple-bedroom-1",
      "executive-suite-sitting-3-2",
    ],
  },
];

export const roomAmenities = [
  { group: "In the room", items: ["Individually controlled air conditioning", "32 inch flat screen TV with satellite channels", "Free wifi", "In-room safe box", "Minibar, stocked on request"] },
  { group: "Bathroom", items: ["Full bath with shower", "Complimentary toiletries", "Bathrobes and slippers", "Hair dryer"] },
  { group: "Working and living", items: ["Tea and coffee making facilities", "Thermos flask", "International direct dial telephone", "Multiple power sockets", "Iron and ironing board on request"] },
  { group: "Access", items: ["Electronic key card entrance", "Clean room and do not disturb switch", "Cloth drying rack on the balcony", "Power adaptor on request"] },
];

export const halls = [
  {
    name: "Tarangire",
    image: "tarangire-conference-hall-1",
    images: [
      "tarangire-conference-hall-1",
      "tarangire-conference-hall-2-1",
      "tarangire-conference-hall-2",
      "tarangire-conference-hall",
    ],
    lead: "Small private meetings, working groups, and board meetings.",
    capacities: [{ style: "Boardroom", pax: 10 }],
    top: 10,
    price: 150,
    priceUnit: "day",
  },
  {
    name: "Serengeti",
    image: "serengeti-conference-hall-1",
    images: ["serengeti-conference-hall-1", "serengeti-conference-hall-2-1"],
    lead: "Private meetings, working groups, press centres.",
    capacities: [
      { style: "U shape", pax: 20 },
      { style: "Classroom", pax: 15 },
    ],
    top: 20,
    price: 250,
    priceUnit: "day",
  },
  {
    name: "Manyara",
    image: "lake-manyara-conference-hall-1",
    images: ["lake-manyara-conference-hall-1", "lake-manyar-conference-hall-1"],
    lead: "Moderate meetings and conferences, press conferences, safari briefings.",
    capacities: [
      { style: "U shape", pax: 50 },
      { style: "Classroom", pax: 70 },
    ],
    top: 70,
    price: 450,
    priceUnit: "day",
  },
  {
    name: "Selous",
    image: "selous-conference-hall-1",
    images: ["selous-conference-hall-1", "selous-conference-hall-2-1"],
    lead: "Larger conferences, and receptions of every kind.",
    price: 700,
    priceUnit: "day",
    capacities: [
      { style: "U shape", pax: 100 },
      { style: "Banquet", pax: 120 },
      { style: "Classroom", pax: 150 },
      { style: "Reception", pax: 150 },
    ],
    top: 150,
  },
];

export const conferenceIncludes = [
  "Hall and full set up",
  "Full air conditioned halls",
  "LCD projector",
  "Public address system",
  "Flip chart, papers and markers",
  "Writing pads and pens",
  "Extension cables for laptops and phones",
  "Free wifi",
  "Mineral water",
  "Mints on the tables",
  "Team building grounds",
  "Backup generator during power outages",
];

export const wellness = [
  {
    name: "Lodge and garden pools",
    image: "back-1",
    hours: "Lodge pool 06:00 to 18:00. Garden pool 10:00 to 18:00.",
    body: "The lodge pool is free to residents, with loungers and towels. The garden pool sits opposite the lodge and opens to visitors for a fee.",
  },
  {
    name: "Masailand Spa",
    image: "spa",
    hours: "08:00 to 18:00, seven days",
    body: "Deep tissue and facial massage, body scrubs, and a steam bath and sauna. Book the steam bath at least an hour ahead.",
  },
  {
    name: "Gym",
    image: "fitness-at-masai-land-safari-lodge",
    hours: "06:00 to 18:00, seven days",
    body: "Free weights, machines, treadmills and cycles, free to residents and looking out over the gardens.",
  },
];

export const dining = {
  lead: "Indoor and poolside dining for house guests, with a menu that runs from Tanzanian cooking to international plates.",
  body: "The Conservatory looks west, so dinner arrives with the sunset. The kitchen builds each dish around what came in fresh that morning.",
  images: ["restaurant", "wine-and-dinner2", "outdoor-bar", "a-134", "fire-place", "masailand-farm-3"],
};

/* Three real facets of Wine & Dine, one image and one message each, rotating
   in place of a single static frame. */
export const diningSlides = [
  {
    image: "restaurant",
    title: "Dinner arrives with the sunset",
    body: dining.lead,
    note: "The Conservatory looks west. Indoors under the glass, or a table by the pool.",
  },
  {
    image: "outdoor-bar",
    title: "A drink at the outdoor bar",
    body: "The bar sits beside the garden, open through the evening for something before or after dinner.",
    note: "Thatched, beside the garden, open through the evening.",
  },
  {
    image: "wine-and-dinner2",
    title: "Wine from the cellar",
    body: "A short list of wine and spirits, poured at the bar most evenings.",
    note: "Ask the kitchen for the day's plate to go with it.",
  },
];

/*
  NOTE: these are illustrative placeholder quotes, not real guest reviews.
  There is no scraped testimonial content to draw from, and no real guest
  photo to honestly attach to an invented name, so attribution stays to a
  plain monogram rather than a stock photo standing in for a real person.
  Swap these for real reviews (the footer already links to Tripadvisor,
  a natural source) before this section ships.
*/
export const testimonials = [
  {
    quote:
      "The view from the balcony alone was worth the trip. Breakfast on the terrace looking at Meru is something I still think about.",
    name: "Amara N.",
    role: "Returning guest",
  },
  {
    quote:
      "We ran a two day offsite in the Manyara hall. The wifi held up, the air conditioning worked, and the lawn outside was a nice touch for the team.",
    name: "Peter K.",
    role: "Operations lead",
  },
  {
    quote:
      "Quiet, well kept, and close enough to Kilimanjaro airport that we didn't lose a day getting there. We'd stay again.",
    name: "Sofia R.",
    role: "Safari traveller",
  },
  {
    quote:
      "The staff went above and beyond to make our anniversary special. The private dinner under the stars was unforgettable.",
    name: "James M.",
    role: "Anniversary celebrant",
  },
  {
    quote:
      "Perfect base for exploring the northern circuit. The rooms were comfortable and the food was exceptional.",
    name: "Lisa T.",
    role: "Adventure traveler",
  },
  {
    quote:
      "I've been to many lodges in Tanzania, but this one stands out for its attention to detail and genuine hospitality.",
    name: "David O.",
    role: "Frequent visitor",
  },
];

/* A spread of real photography for the mosaic, not a slideshow of any one
   room, so it reads as "the lodge" rather than an ad for a specific suite. */
export const testimonialGallery = [
  "hotel-front-view-1",
  "executive-suite-sitting-2",
  "garden-pool-1",
  "reception-1",
  "spa-1",
  "masailand-cottages",
  "fire-place",
  "outdoor-bar",
  "a-134",
];

export const bookDirect = [
  "Best available rate, guaranteed",
  "No fees and no hidden extras",
  "Talk to the lodge directly, not an agent",
  "Flexible dates and on-hand assistance",
];

/* NOTE: this side of the comparison is written for this redesign, not
   scraped from the original site. It stays to generic, true-of-the-industry
   framing (booking fees, markup, no direct line) rather than any claim about
   a named competitor. */
export const bookAgent = [
  "A booking fee added on top of the room rate",
  "A marked-up rate that can change without notice",
  "Changes and requests go through a call centre",
  "No direct line to anyone at the lodge",
];

/*
  Content for the magazine-style blocks (explore grid / trending row /
  editorial split / spotlight strip) on every inner page. All images are
  real property photography already used elsewhere in the site; captions
  describe what is actually in frame rather than inventing article-style
  headlines, and every link routes to a real page or anchor.
*/
export const pageMagazine = {
  rooms: {
    explore: {
      title: "Inside the rooms",
      items: [
        { src: "deluxe-room-single-or-double-2", alt: "A deluxe room made up with a queen bed", label: "Deluxe Room, queen bed" },
        { src: "deluxe-rooms-twin-2", alt: "A deluxe room made up as a twin", label: "Deluxe Room, twin beds" },
        { src: "balcony", alt: "The private balcony off a guest room", label: "Every room opens onto a balcony" },
        { src: "deluxe-room-bathroom-2", alt: "Ensuite bathroom of a deluxe room", label: "Ensuite bathroom" },
        { src: "executive-suite-sitting-2", alt: "Sitting area of an executive suite", label: "Executive Suite lounge" },
        { src: "executive-suite-twin-2", alt: "Executive suite made up as a twin", label: "Executive Suite, twin beds" },
        { src: "triple-bedroom", alt: "A family room with three beds", label: "Family & Interconnecting rooms" },
        { src: "executive-suite-bathroom-2", alt: "Bathroom of an executive suite", label: "Executive Suite bathroom" },
      ],
    },
    trending: {
      title: "Beyond the room",
      cards: [
        { src: "garden-pool-1", alt: "The garden swimming pool with loungers and parasols", title: "Two pools and a spa", meta: "Free to residents", href: "/wellness" },
        { src: "restaurant", alt: "Dishes on the buffet line at the restaurant", title: "Dinner with the sunset", meta: "The Conservatory", href: "/wine-dine" },
      ],
      list: [
        { src: "selous-conference-hall-1", alt: "The largest conference hall set up for a reception", title: "Conferences & Events", meta: "Four halls, up to 150 seats", href: "/conferences" },
        { src: "masailand-cottages", alt: "Cottages set among the gardens", title: "Gallery", meta: "The property in photographs", href: "/gallery" },
        { src: "reception-2", alt: "The curved marble staircase in the lobby", title: "Contact Us", meta: "Plan a stay", href: "/contact" },
      ],
      feature: {
        tag: "Wellness",
        title: "Two pools, a spa, and a gym that faces the garden",
        excerpt: "The lodge pool and gym are free to residents, with a spa offering deep tissue massage, a steam bath and sauna.",
        src: "back-1",
        alt: "The swimming pool running along the front of the lodge",
        href: "/wellness",
      },
    },
    editorial: {
      title: "Featured room",
      tag: "Executive Suite",
      heading: "A lounge that closes off, and a balcony that catches both ends of the day",
      excerpt: "133 sqm, one double bed and two singles, and a private balcony looking out over the plantations toward Mount Meru.",
      src: "executive-suite-sitting-room-1",
      alt: "Sitting room of an executive suite, finished in warm terracotta with teak furniture",
      href: "/rooms-suites#executive",
      list: [
        { src: "deluxe-room-single-or-double-2", alt: "A deluxe room made up with a queen bed", title: "Deluxe Room", meta: "16.8 sqm · 2 adults", href: "/rooms-suites#deluxe" },
        { src: "triple-bedroom", alt: "A family room with three beds", title: "Family & Interconnecting", meta: "Up to 8 adults", href: "/rooms-suites#family" },
        { src: "masailand-cottages", alt: "Cottages set among the gardens", title: "Cottages & gardens", meta: "Nine cottages", href: "/gallery" },
        { src: "walkway-to-rooms-1small", alt: "The covered walkway leading to the guest rooms", title: "Getting around", meta: "Covered walkways throughout", href: "/gallery" },
      ],
    },
    spotlight: {
      title: "Room by room",
      items: [
        { src: "balcony-2", alt: "View from a room balcony over the gardens", tag: "Balcony", title: "On every room", desc: "All 54 rooms open onto one, with a cloth drying rack and a chair to sit out on.", href: "/rooms-suites#deluxe" },
        { src: "executive-suite-coffee-working-station-2", alt: "A working corner with coffee station in an executive suite", tag: "Suite", title: "A place to work", desc: "Tea and coffee making, a direct dial telephone and sockets enough for a laptop.", href: "/rooms-suites#executive" },
        { src: "family-room-2-mid", alt: "A family room with connecting doors", tag: "Family", title: "Rooms that interconnect", desc: "Two full rooms joined by a door that locks from both sides. Sleeps up to eight.", href: "/rooms-suites#family" },
        { src: "deluxe-room-1-mid", alt: "A deluxe room with garden view", tag: "Deluxe", title: "Garden views", desc: "16.8 sqm, a queen bed and an ensuite, with double glazing to keep the room quiet.", href: "/rooms-suites#deluxe" },
      ],
    },
  },

  wellness: {
    explore: {
      title: "Around the wellness centre",
      items: [
        { src: "back-1", alt: "The swimming pool running along the front of the lodge", label: "The lodge pool" },
        { src: "garden-pool-1", alt: "The garden swimming pool with loungers and parasols", label: "The garden pool" },
        { src: "inside-pool", alt: "A view across the lodge pool", label: "Loungers and towels, free to residents" },
        { src: "spa", alt: "A treatment room at the Masailand spa", label: "The Masailand Spa" },
        { src: "spa-1", alt: "A massage room at the spa", label: "Deep tissue and facial massage" },
        { src: "gym-1-1", alt: "Free weights and machines in the gym", label: "Free weights and machines" },
        { src: "gyme-masai-land", alt: "Treadmills and cycles in the gym", label: "Treadmills and cycles" },
        { src: "fitness-at-masai-land-safari-lodge", alt: "The gym looking out over the garden", label: "The gym faces the garden" },
      ],
    },
    trending: {
      title: "Make a day of it",
      cards: [
        { src: "executive-suite-sitting-2", alt: "Sitting area of an executive suite", title: "Rooms & Suites", meta: "Fifty four rooms", href: "/rooms-suites" },
        { src: "restaurant", alt: "Dishes on the buffet line at the restaurant", title: "Wine & Dine", meta: "Poolside and indoor dining", href: "/wine-dine" },
      ],
      list: [
        { src: "selous-conference-hall-1", alt: "The largest conference hall set up for a reception", title: "Conferences & Events", meta: "Team building grounds included", href: "/conferences" },
        { src: "masailand-cottages", alt: "Cottages set among the gardens", title: "Gallery", meta: "The property in photographs", href: "/gallery" },
        { src: "reception-2", alt: "The curved marble staircase in the lobby", title: "Contact Us", meta: "Ask about a stay", href: "/contact" },
      ],
      feature: {
        tag: "Rooms & Suites",
        title: "Every one of the 54 rooms opens onto a balcony",
        excerpt: "Deluxe rooms, executive suites with a private lounge, and family rooms that interconnect.",
        src: "executive-suite-sitting-room-1",
        alt: "Sitting room of an executive suite, finished in warm terracotta with teak furniture",
        href: "/rooms-suites",
      },
    },
    editorial: {
      title: "Featured space",
      tag: "Masailand Spa",
      heading: "Deep tissue massage, a steam bath and sauna",
      excerpt: "Open 08:00 to 18:00, seven days. The steam bath needs a slot booked at least an hour ahead.",
      src: "spa-1",
      alt: "A massage room at the spa",
      href: "/wellness#spa",
      list: [
        { src: "back-1", alt: "The swimming pool running along the front of the lodge", title: "Lodge & garden pools", meta: "06:00 to 18:00", href: "/wellness#pools" },
        { src: "gym-1-1", alt: "Free weights and machines in the gym", title: "Gym", meta: "06:00 to 18:00", href: "/wellness#gym" },
        { src: "outdoor-bar", alt: "The thatched outdoor bar beside the garden", title: "Outdoor bar", meta: "Beside the garden", href: "/wine-dine" },
        { src: "fire-place", alt: "The fireplace in the lounge", title: "The lounge", meta: "A fire pit in the evening", href: "/gallery" },
      ],
    },
    spotlight: {
      title: "A few more corners",
      items: [
        { src: "garden-2small", alt: "The gardens surrounding the pool", tag: "Gardens", title: "Lawns and flowering trees", desc: "The lawns wrap the cottages and run down to the pool terrace.", href: "/gallery" },
        { src: "masailand-garden-1", alt: "A garden path lined with plants", tag: "Gardens", title: "Paths through the grounds", desc: "Covered walkways and planted paths connect the rooms to the lodge.", href: "/gallery" },
        { src: "sunset-view", alt: "Sunset over the property", tag: "Views", title: "Evening light on the hill", desc: "The property looks west, so the last of the light lands on the gardens.", href: "/gallery" },
        { src: "meru-view-lounge", alt: "Mount Meru seen from the lounge", tag: "Views", title: "Mount Meru from the lounge", desc: "Meru fills the horizon to the east, clearest first thing in the morning.", href: "/gallery" },
      ],
    },
  },

  conferences: {
    explore: {
      title: "Inside the halls",
      items: [
        { src: "tarangire-conference-hall-1", alt: "Tarangire conference hall set up boardroom style", label: "Tarangire, boardroom" },
        { src: "tarangire-conference-hall-2", alt: "Tarangire conference hall, alternate view", label: "Tarangire Hall" },
        { src: "serengeti-conference-hall-1", alt: "Serengeti conference hall set up in a U shape", label: "Serengeti, U shape" },
        { src: "serengeti-conference-hall-2-1", alt: "Serengeti conference hall, alternate view", label: "Serengeti Hall" },
        { src: "lake-manyara-conference-hall-1", alt: "Manyara conference hall set up classroom style", label: "Manyara, classroom" },
        { src: "selous-conference-hall-1", alt: "Selous conference hall set up for a reception", label: "Selous, reception" },
        { src: "selous-conference-hall-2-1", alt: "Selous conference hall, alternate view", label: "Selous Hall" },
        { src: "santa-fee", alt: "A team building space on the grounds", label: "Team building grounds" },
      ],
    },
    trending: {
      title: "Around the stay",
      cards: [
        { src: "executive-suite-sitting-2", alt: "Sitting area of an executive suite", title: "Rooms & Suites", meta: "For overnight delegates", href: "/rooms-suites" },
        { src: "restaurant", alt: "Dishes on the buffet line at the restaurant", title: "Wine & Dine", meta: "Catering and breaks", href: "/wine-dine" },
      ],
      list: [
        { src: "back-1", alt: "The swimming pool running along the front of the lodge", title: "Wellness", meta: "Free to residents", href: "/wellness" },
        { src: "masailand-cottages", alt: "Cottages set among the gardens", title: "Gallery", meta: "The property in photographs", href: "/gallery" },
        { src: "reception-2", alt: "The curved marble staircase in the lobby", title: "Contact Us", meta: "Ask about rates", href: "/contact" },
      ],
      feature: {
        tag: "Largest hall",
        title: "Selous: receptions of every kind, up to 150 seats",
        excerpt: "U shape, banquet, classroom or reception layout, with the same full equipment list as every hall.",
        src: "selous-conference-hall-1",
        alt: "The largest conference hall set up for a reception",
        href: "/conferences#selous",
      },
    },
    editorial: {
      title: "Featured hall",
      tag: "Manyara",
      heading: "Conferences and safari briefings, seventy seats classroom style",
      excerpt: "The mid-size hall, set up U shape for fifty or classroom for seventy, with the same full air conditioning and backup power as the rest.",
      src: "lake-manyara-conference-hall-1",
      alt: "Manyara conference hall set up classroom style",
      href: "/conferences#manyara",
      list: [
        { src: "tarangire-conference-hall-1", alt: "Tarangire conference hall set up boardroom style", title: "Tarangire", meta: "10 seats, boardroom", href: "/conferences#tarangire" },
        { src: "serengeti-conference-hall-1", alt: "Serengeti conference hall set up in a U shape", title: "Serengeti", meta: "20 seats, U shape", href: "/conferences#serengeti" },
        { src: "selous-conference-hall-1", alt: "The largest conference hall set up for a reception", title: "Selous", meta: "Up to 150 seats", href: "/conferences#selous" },
        { src: "outdoor-bar", alt: "The thatched outdoor bar beside the garden", title: "Team building", meta: "Grounds included", href: "/conferences" },
      ],
    },
    spotlight: {
      title: "What's included",
      items: [
        { src: "tarangire-conference-hall-2-1", alt: "A conference table set with papers and water", tag: "Included", title: "Full set up and stationery", desc: "Flip chart, papers and markers, writing pads and pens, mineral water and mints.", href: "/conferences" },
        { src: "serengeti-conference-hall-2-1", alt: "A hall set up with a projector and screen", tag: "Included", title: "LCD projector and PA system", desc: "Projector, public address and extension cables for laptops and phones.", href: "/conferences" },
        { src: "lake-manyar-conference-hall-1", alt: "A conference hall with air conditioning", tag: "Included", title: "Full air conditioning", desc: "Every hall is air conditioned throughout, with free wifi across the property.", href: "/conferences" },
        { src: "selous-conference-hall-2-1", alt: "A hall set up for a large reception", tag: "Included", title: "Backup generator", desc: "Power stays on through outages, so a session never stops halfway.", href: "/conferences" },
      ],
    },
  },

  gallery: {
    explore: {
      title: "The grounds",
      items: [
        { src: "hotel-front-view-2", alt: "The lodge entrance from a different angle", label: "The lodge entrance" },
        { src: "front-2", alt: "The front approach to the lodge", label: "The approach" },
        { src: "walkway-to-rooms-2small", alt: "A covered walkway between the rooms", label: "Covered walkways" },
        { src: "masailand-farm-1", alt: "Rows of vegetables in the lodge farm", label: "The kitchen garden" },
        { src: "masailand-farm-2", alt: "The lodge farm and surrounding plantations", label: "Plantations around the lodge" },
        { src: "layout-2", alt: "An aerial view of the lodge grounds", label: "The grounds from above" },
        { src: "photo-2019-04-21-11-46-29", alt: "A view across the property", label: "Around the property" },
        { src: "masailand-back-view-nightmode", alt: "The lodge lit up in the evening", label: "The lodge after dark" },
      ],
    },
    trending: {
      title: "Plan the stay",
      cards: [
        { src: "executive-suite-sitting-2", alt: "Sitting area of an executive suite", title: "Rooms & Suites", meta: "Fifty four rooms", href: "/rooms-suites" },
        { src: "restaurant", alt: "Dishes on the buffet line at the restaurant", title: "Wine & Dine", meta: "The Conservatory", href: "/wine-dine" },
      ],
      list: [
        { src: "back-1", alt: "The swimming pool running along the front of the lodge", title: "Wellness", meta: "Two pools, a spa and a gym", href: "/wellness" },
        { src: "selous-conference-hall-1", alt: "The largest conference hall set up for a reception", title: "Conferences & Events", meta: "Four halls", href: "/conferences" },
        { src: "reception-2", alt: "The curved marble staircase in the lobby", title: "Contact Us", meta: "Ask a question", href: "/contact" },
      ],
      feature: {
        tag: "The hilltop",
        title: "A hill above Arusha, with Meru on the horizon",
        excerpt: "Nine cottages and fifty four rooms outside Arusha, 45 minutes from Kilimanjaro International Airport.",
        src: "kisongo-valleys-view",
        alt: "The pool terrace looking out over the Kisongo valleys towards the hills",
        href: "/gallery",
      },
    },
    editorial: {
      title: "A closer look",
      tag: "Reception",
      heading: "The lobby, and the staircase that greets every guest",
      excerpt: "Curved marble stairs and warm lighting set the tone the moment a guest arrives.",
      src: "reception-1",
      alt: "The reception desk and lobby",
      href: "/gallery",
      list: [
        { src: "fire-place", alt: "The fireplace in the lounge", title: "The lounge fireplace", meta: "Evenings on the hill", href: "/gallery" },
        { src: "outdoor-bar", alt: "The thatched outdoor bar beside the garden", title: "The outdoor bar", meta: "Beside the garden", href: "/wine-dine" },
        { src: "a-134", alt: "The terrace lounge looking down over the pool", title: "The terrace", meta: "Looking over the pool", href: "/gallery" },
        { src: "masailand-cottages", alt: "Cottages set among the gardens", title: "The cottages", meta: "Nine, among the lawns", href: "/rooms-suites" },
      ],
    },
    spotlight: {
      title: "More frames",
      items: [
        { src: "garden-3small", alt: "A garden path among flowering trees", tag: "Gardens", title: "Lawns and flowering trees", desc: "Nine cottages sit among the lawns, wrapped in flowering trees.", href: "/gallery" },
        { src: "back-view", alt: "The back of the lodge from the garden", tag: "Grounds", title: "The lodge from the garden", desc: "The rear elevation, seen across the lawn that runs down from the terrace.", href: "/gallery" },
        { src: "back-2small", alt: "The pool terrace at the back of the lodge", tag: "Pool", title: "The pool terrace", desc: "The lodge pool, open 06:00 to 18:00 and free to residents.", href: "/wellness" },
        { src: "pics-5", alt: "A view across the property grounds", tag: "Grounds", title: "Around the hilltop", desc: "Masailand rests at the top of a hill outside Arusha, with Meru to the east.", href: "/gallery" },
      ],
    },
  },

  dine: {
    explore: {
      title: "In the kitchen and at the table",
      items: [
        { src: "restaurant1", alt: "The indoor restaurant set for dinner", label: "The Conservatory" },
        { src: "restaurant3", alt: "A table set for dinner at the restaurant", label: "Dinner with a view of the sunset" },
        { src: "restaurant4", alt: "Dishes served at the restaurant", label: "Tanzanian and international plates" },
        { src: "restaurant5", alt: "The restaurant interior", label: "Indoor dining" },
        { src: "outdoor-restaurant-1-poolsmall", alt: "Poolside dining tables", label: "Poolside dining" },
        { src: "outdoor-restaurant-2small", alt: "Tables set for outdoor dining", label: "Under the open sky" },
        { src: "wine", alt: "Bottles of wine from the cellar", label: "Wine from the cellar" },
        { src: "masailand-farm-3", alt: "A chef cutting greens in the lodge's vegetable garden", label: "Built around what came in fresh" },
      ],
    },
    trending: {
      title: "Around the meal",
      cards: [
        { src: "back-1", alt: "The swimming pool running along the front of the lodge", title: "Wellness", meta: "A swim before dinner", href: "/wellness" },
        { src: "executive-suite-sitting-2", alt: "Sitting area of an executive suite", title: "Rooms & Suites", meta: "Fifty four rooms", href: "/rooms-suites" },
      ],
      list: [
        { src: "selous-conference-hall-1", alt: "The largest conference hall set up for a reception", title: "Conferences & Events", meta: "Catering on request", href: "/conferences" },
        { src: "masailand-cottages", alt: "Cottages set among the gardens", title: "Gallery", meta: "The property in photographs", href: "/gallery" },
        { src: "reception-2", alt: "The curved marble staircase in the lobby", title: "Contact Us", meta: "Ask about a table", href: "/contact" },
      ],
      feature: {
        tag: "Outdoor bar",
        title: "A drink at the outdoor bar",
        excerpt: "The bar sits beside the garden, open through the evening for something before or after dinner.",
        src: "outdoor-bar",
        alt: "The thatched outdoor bar beside the garden",
        href: "/wine-dine",
      },
    },
    editorial: {
      title: "Featured room",
      tag: "The Conservatory",
      heading: "Dinner arrives with the sunset",
      excerpt: "The Conservatory faces west, so the light lands on the table through dinner. Indoor and poolside seating, with a menu that runs from Tanzanian cooking to international plates.",
      src: "restaurant",
      alt: "Dishes on the buffet line at the restaurant",
      href: "/wine-dine",
      list: [
        { src: "wine-and-dinner2", alt: "Guests raising a toast at the bar in the evening", title: "The bar", meta: "Open through the evening", href: "/wine-dine" },
        { src: "indoor-restaurant-2small", alt: "Indoor seating at the restaurant", title: "Indoor seating", meta: "The Conservatory", href: "/wine-dine" },
        { src: "outdoor-restaurant-3small", alt: "Outdoor tables beside the pool", title: "Poolside seating", meta: "Under the sky", href: "/wine-dine" },
        { src: "fire-place", alt: "The fireplace in the lounge", title: "After dinner", meta: "The lounge fire", href: "/gallery" },
      ],
    },
    spotlight: {
      title: "A few more frames",
      items: [
        { src: "indoor-restaurant-1small", alt: "Table settings at the indoor restaurant", tag: "Indoor", title: "The Conservatory, set for dinner", desc: "Indoors under the glass, with the menu built around what came in that morning.", href: "/wine-dine" },
        { src: "indoor-restaurant-3small", alt: "The restaurant interior in the evening", tag: "Indoor", title: "Evening light indoors", desc: "The room looks west, so dinner arrives with the sunset.", href: "/wine-dine" },
        { src: "outdoor-restaurant-2small", alt: "Tables set for outdoor dining", tag: "Outdoor", title: "Dining beside the pool", desc: "Take a table by the pool instead. Open to house guests through the day.", href: "/wine-dine" },
        { src: "indoor-restaurant-4small", alt: "A table set for a group at the restaurant", tag: "Indoor", title: "Tables for groups", desc: "Larger tables for families and groups travelling together.", href: "/wine-dine" },
      ],
    },
  },
};

export const gallery = [
  { src: "hotel-front-view-1", alt: "The lodge entrance behind clipped topiary and palms", span: "tall" },
  { src: "kisongo-valleys-view", alt: "The pool terrace looking out over the Kisongo valleys", span: "wide" },
  { src: "executive-suite-sitting-room-1", alt: "Sitting room of an executive suite in warm terracotta" },
  { src: "back-1", alt: "The swimming pool running along the front of the lodge", span: "wide" },
  { src: "reception-2", alt: "The curved marble staircase in the lobby" },
  { src: "masailand-farm-3", alt: "A chef cutting greens in the lodge's vegetable garden" },
  { src: "restaurant", alt: "Dishes on the buffet line at the restaurant" },
  { src: "masailand-cottages", alt: "Cottages set among the gardens", span: "tall" },
  { src: "spa-1", alt: "Treatment room at the Masailand spa" },
  { src: "layout-1", alt: "The lodge and its cottages seen from the air" },
  { src: "reception-1", alt: "The reception desk and lobby" },
  { src: "masailand-farm-2", alt: "The lodge farm and surrounding plantations", span: "wide" },
  { src: "outdoor-bar", alt: "The thatched outdoor bar beside the garden" },
  { src: "deluxe-room-single-or-double-2", alt: "A deluxe room made up with a queen bed" },
  { src: "fire-place", alt: "The fireplace in the lounge" },
  { src: "a-134", alt: "The terrace lounge looking down over the pool" },
];

/*
  Slide sets for PageHeroSlider, the same full-bleed slider mechanic as the
  homepage Hero, reused to open the inner pages that have three or four real
  sub-destinations to rotate through. Derived from the page's own data
  arrays above rather than re-typed, so a change to a room, hall or wellness
  entry stays in sync with its slide automatically.
*/
export const roomsHeroSlides = rooms.map((room) => ({
  img: room.images[0],
  alt: `${room.name} at Masailand Safari and Lodge`,
  titleA: room.name,
  sub: room.lead,
  note: `${room.area} · ${room.sleeps} · ${room.views}`,
  place: room.name,
  desc: `${room.area} · ${room.sleepsShort}`,
  href: `/rooms-suites#${room.slug}`,
}));

export const wellnessHeroSlides = wellness.map((w, i) => ({
  img: w.image,
  alt: w.name,
  titleA: w.name,
  sub: w.body,
  note: w.hours,
  place: w.name,
  desc: w.hours,
  href: `/wellness#${["pools", "spa", "gym"][i]}`,
}));

export const conferencesHeroSlides = halls.map((hall) => ({
  img: hall.image,
  alt: `${hall.name} hall at Masailand Safari and Lodge`,
  titleA: `${hall.name} Hall`,
  sub: hall.lead,
  note: hall.capacities.map((c) => `${c.style} ${c.pax}`).join(" · "),
  place: hall.name,
  desc: `Up to ${hall.top} seats`,
  href: `/conferences#${hall.name.toLowerCase()}`,
}));

export const dineHeroSlides = diningSlides.map((slide) => ({
  img: slide.image,
  alt: slide.title,
  titleA: slide.title,
  sub: slide.body,
  note: slide.note,
  place: slide.title,
  desc: "Wine & Dine",
  href: "/wine-dine",
}));
