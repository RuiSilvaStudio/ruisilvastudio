export const SITE = {
  name: 'Rui Silva Studio',
  tagline: 'Furniture as Cultural Infrastructure',
  description:
    'Contemporary design practice creating one-of-a-kind collectible furniture. Handcrafted in Portugal in limited numbers — white oak, steel, brass and porcelain.',
  url: 'https://www.ruisilvastudio.com',
  email: 'rui.silva@ruisilvastudio.com',
  phone: '(+351) 91 411 39 33',
  phoneHref: '+351914113933',
  address: {
    street: 'Rua Rio Ave, 1970',
    locality: 'Prazins (Santa Eufémia)',
    postal: '4800-615 Guimarães',
    country: 'Portugal',
  },
  founded: 2024,
};

export const NAV = [
  { label: 'Collection', href: '/lusitano/story' },
  { label: 'Pieces', dropdown: true, children: [
    { label: 'Credenza', href: '/lusitano/credenza', img: '/images/collection/credenza-card.webp', desc: 'Storage as architecture' },
    { label: 'Coffee Table', href: '/lusitano/coffee-table', img: '/images/collection/coffee-table-card.webp', desc: 'Oak, steel & glass in sculpture' },
    { label: 'Bookshelf', href: '/lusitano/bookshelf', img: '/images/collection/bookshelf-card.webp', desc: 'A console to live with' },
    { label: 'Floor Lamp', href: '/lusitano/floor-lamp', img: '/images/collection/floor-lamp-card.webp', desc: 'Light held in balance' },
    { label: 'Sofa Armrest', href: '/lusitano/sofa-armrest', img: '/images/collection/armrest-card.webp', desc: 'Everyday presence' },
  ]},
  { label: 'Studio Works', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Studio Partnership', href: '/studio-partnership' },
  { label: 'Contact', href: '/contact' },
];

export interface Piece {
  slug: string;
  name: string;
  short: string;
  description: string[];
  card: string;
  images: string[];
  features?: string[];
  materials: string[];
  dimensions: { label: string; value: string }[];
  customisation?: string[];
  technical?: string[];
  suggestion?: { text: string; pieceSlug: string };
}

export const PIECES: Piece[] = [
  {
    slug: 'credenza',
    name: 'Lusitano Credenza',
    short: 'A console where storage becomes architecture.',
    description: [
      'I designed the Credenza as storage with architectural presence. Oak brings warmth; steel sharpens the lines; ceramic adds a quiet, durable surface. Integrated cable management and wireless charging keep technology out of sight while the piece remains calm in the room.',
      'Every credenza is made to order in my Studio workshop, with the possibility to tailor finishes to your home. Whether in oak, walnut, or another species, I craft each one as a lasting object - to be lived with over time.',
    ],
    card: '/images/collection/credenza-card.webp',
    images: ['/images/products/credenza/credenza-01.webp', '/images/products/credenza/credenza-02.webp', '/images/hero/credenza-hero.webp'],
    features: [
      'Two different size drawers',
      'One cabinet with dropdown door',
      'One sliding door compartment',
      'Two open shelves on each side',
      'Two spots with wireless charging',
      'Cable management integrated',
    ],
    materials: [
      'Natural solid white oak, satin varnish clear coating',
      'Black satin steel',
      'Ceramic surface and drawer front panels',
    ],
    dimensions: [
      { label: 'Width', value: '276 cm' },
      { label: 'Height', value: '86.5 cm' },
      { label: 'Depth', value: '52 cm' },
    ],
    customisation: ['Wood and ceramic - materials and finishes adapted to your project on request.'],
    suggestion: { text: 'For a smaller counterpart to the Credenza, I suggest the Lusitano Coffee Table - sharing the same crafted balance in oak and steel.', pieceSlug: 'coffee-table' },
  },
  {
    slug: 'coffee-table',
    name: 'Lusitano Coffee Table',
    short: 'Where oak, steel, and glass meet in sculpture.',
    description: [
      'The Lusitano Coffee Table was designed as a sculptural centrepiece - a composition of oak and steel that defines a living space. Each tabletop is crafted in solid oak, joined and finished by hand, with brushed steel details that frame the geometry.',
      'Every table is made to order in my Studio workshop, with the option to tailor finishes. Whether paired with the Lusitano Credenza or placed on its own, it is a piece intended to hold presence in daily life.',
    ],
    card: '/images/collection/coffee-table-card.webp',
    images: ['/images/products/coffee-table/coffee-table-01.webp', '/images/products/coffee-table/coffee-table-02.webp', '/images/products/coffee-table/coffee-table-03.webp'],
    features: [
      'Two different size shelves under the table top',
      'LED strip enclosed under the wooden top, lighting the epoxy detail',
    ],
    materials: [
      'Natural solid white oak',
      'Valchromat composite',
      'Ceramic surface',
      'Satin black brushed steel',
      'Brushed brass',
      'Tempered smoked black glass',
    ],
    dimensions: [
      { label: 'Length', value: '101 cm' },
      { label: 'Width', value: '63 cm' },
      { label: 'Height', value: '42 cm' },
    ],
    suggestion: { text: 'The same exploration of rhythm and proportion continues in the Lusitano Bookshelf, where vertical lines become both functional and architectural.', pieceSlug: 'bookshelf' },
  },
  {
    slug: 'bookshelf',
    name: 'Lusitano Sofa-side Bookshelf',
    short: 'A console designed to live with.',
    description: [
      'I designed this piece to live with the sofa. A slim console with integrated shelves that keeps books and objects close to hand. Oak brings warmth; the satin black frame gives definition.',
      'The proportions are quiet and deliberate, allowing it to sit discreetly against the armrest while adding useful surface and rhythm to the room. Each is made to order, conceived as part of the Lusitano collection but working equally as a stand-alone piece.',
    ],
    card: '/images/collection/bookshelf-card.webp',
    images: ['/images/products/bookshelf/bookshelf-01.webp', '/images/products/bookshelf/bookshelf-02.webp', '/images/products/bookshelf/bookshelf-03.webp'],
    materials: ['Natural solid white oak', 'Black satin steel frame'],
    dimensions: [
      { label: 'Height', value: '43 cm' },
      { label: 'Shelf height', value: '25 cm' },
      { label: 'Length', value: '123 cm' },
      { label: 'Width', value: '22 cm' },
    ],
    customisation: ['Wood species and steel finish on request.'],
    suggestion: { text: 'That same sense of quiet presence guides the Lusitano Floor Lamp, where structure and light come together in a subtle dialogue.', pieceSlug: 'floor-lamp' },
  },
  {
    slug: 'floor-lamp',
    name: 'Lusitano Floor Lamp',
    short: 'Light held in balance by oak and steel.',
    description: [
      'The lamp is a simple vertical composition. Oak carries the form; a steel spine keeps it precise. It casts a soft, diffused light that sits naturally beside the sofa.',
      'Each lamp is made to order in my Studio workshop, with options to customise steel tones and timber. It is designed as a companion to the Lusitano collection, but stands equally well as a singular sculptural light.',
    ],
    card: '/images/collection/floor-lamp-card.webp',
    images: ['/images/products/floor-lamp/floor-lamp-01.webp', '/images/products/floor-lamp/floor-lamp-02.webp'],
    materials: ['Natural solid white oak, satin varnish', 'Black satin brushed steel'],
    dimensions: [
      { label: 'Total height', value: '168 cm' },
      { label: 'Stand height', value: '139 cm' },
      { label: 'Stand base area', value: '40 × 37 cm' },
      { label: 'Lampshade height', value: '25 cm' },
      { label: 'Lampshade diameter', value: '40 cm' },
    ],
    customisation: ['Lampshade can be swapped on request', 'Steel colour, other metals and wood species on request'],
    technical: ['European socket, prepared for 220V / 16A'],
    suggestion: { text: 'A simple surface for everyday presence - the Lusitano Sofa Armrest completes the living setting.', pieceSlug: 'sofa-armrest' },
  },
  {
    slug: 'sofa-armrest',
    name: 'Lusitano Sofa Armrest',
    short: 'A simple surface for everyday presence.',
    description: [
      'I made this armrest tray to add a simple, stable surface where you relax most. It sits securely over the sofa arm, bringing a small piece of solid oak into daily use - a place for a book, a cup, or the evening ritual.',
    ],
    card: '/images/collection/armrest-card.webp',
    images: ['/images/products/armrest/armrest-01.webp', '/images/products/armrest/armrest-02.webp'],
    materials: ['Natural solid white oak, clear satin varnish'],
    dimensions: [
      { label: 'Width', value: '44 cm' },
      { label: 'Length', value: '61 cm' },
      { label: 'Inner height', value: '10.5 cm' },
      { label: 'Inner width', value: '39.9 cm' },
    ],
    suggestion: { text: 'Explore the Lusitano Coffee Table for a complete living setting.', pieceSlug: 'coffee-table' },
  },
];

export const MATERIALS = [
  { name: 'White Oak', role: 'Main material', note: 'Solid wood, finished in clear hard varnish for protection.', img: '/images/materials/white-oak.webp' },
  { name: 'Steel', role: 'Structural', note: 'Painted satin black, brushed.', img: '/images/materials/steel.webp' },
  { name: 'Ceramic', role: 'Details with function', note: '10 mm tile, quiet and durable.', img: '/images/materials/ceramic.webp' },
  { name: 'Glass', role: 'Lightness', note: 'Tempered, smoked black.', img: '/images/materials/glass.webp' },
  { name: 'Brass', role: 'Detail support', note: 'Solid brass, brushed.', img: '/images/materials/brass.webp' },
];

export const FAQS = [
  {
    q: 'Do you ship internationally?',
    a: 'Yes - we arrange international shipping for our pieces. Because every item is made to order, costs, timelines, duties and taxes vary by destination. We provide full information and delivery support when you contact us about your order.',
  },
  {
    q: 'Can I customize one of your existing pieces?',
    a: 'Yes - dimensions, finishes and materials can be customised within reason, always respecting each piece’s structural integrity and available materials. The core design of each work cannot be modified, as it is part of a limited collection.',
  },
  {
    q: 'How can I place an order or request a quote?',
    a: 'All orders and inquiries are handled personally. Contact us by email to start the conversation - we’ll guide you through quotes, lead times and customisation, and may continue by phone or video call for a more personal, detailed experience.',
  },
  {
    q: 'Do you accept bespoke commissions?',
    a: 'We’re open to bespoke projects when they align with the studio’s design language and values. Rather than acting as an OEM, we view custom work as a collaboration - a shared exploration that builds on our creative direction.',
  },
  {
    q: 'Can I view your pieces in person?',
    a: 'Yes - studio visits are welcome by appointment. We’re based in northern Portugal; the space isn’t a public showroom, but we’re happy to host clients who’d like to experience the pieces firsthand.',
  },
  {
    q: 'What are your typical lead times?',
    a: 'Lead times vary with the piece, level of customisation and material availability. As a guideline, production and delivery take between 6 and 16 weeks. We don’t stock unnecessary raw materials, in line with our values of sustainability and responsible sourcing.',
  },
];
